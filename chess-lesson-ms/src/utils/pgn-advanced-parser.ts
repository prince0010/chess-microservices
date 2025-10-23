import * as path from 'path';
import * as fs from 'fs';
import { RpcException } from '@nestjs/microservices';
import { PgnMove } from '@mliebelt/pgn-types';
import * as mliebelt from '@mliebelt/pgn-parser';
import { Chess } from 'chess.js';

import {
  AdvancedMovesTree,
  ParsedAdvancedLesson,
} from 'src/modules/lesson/interfaces';

/**
 * Parses a complex PGN file into a structured format with FEN tracking.
 */
export const parseAdvancedPgnFile = (
  filename: string,
  filePath: string,
): ParsedAdvancedLesson[] => {
  try {
    const fullPath = path.resolve(filePath);
    let pgnContent = fs.readFileSync(fullPath, 'utf-8');

    if (!pgnContent) {
      throw new Error(`PGN file not found at path: ${filePath}`);
    }

    // Remove BOM if exists
    if (pgnContent.charCodeAt(0) === 0xfeff) {
      pgnContent = pgnContent.slice(1);
    }

    // Parse PGN using @mliebelt/pgn-parser
    const parsed = mliebelt.parse(pgnContent, { startRule: 'games' });
    const games: mliebelt.ParseTree[] = Array.isArray(parsed)
      ? (parsed as mliebelt.ParseTree[])
      : [parsed as mliebelt.ParseTree];

    return games.map((game) => {
      const headers = Object.fromEntries(
        (game.tags ? Object.entries(game.tags) : []).map(([key, value]) => [
          key,
          value,
        ]),
      );

      // --- CRUCIAL FIX for Metadata Date Objects ---
      // The parser returns date fields as objects (e.g., { value: '2023.03.04', ... })
      // We must extract the string value for clean storage.
      const getDateValue = (headerValue: any) => {
        if (
          typeof headerValue === 'object' &&
          headerValue !== null &&
          'value' in headerValue
        ) {
          return headerValue.value;
        }
        return headerValue || '????.??.??';
      };
      // STEP 1: Headers
      const metadata: any = {
        event: headers['Event'] || '?',
        site: headers['Site'] || '?',
        date: getDateValue(headers['Date']),
        round: headers['Round'] || '?',
        white: headers['White'] || '?',
        black: headers['Black'] || '?',
        result: headers['Result'] || '*',
        eco: headers['ECO'] || '',
        annotator: headers['Annotator'] || '',
        // Ensure PlyCount is parsed as a number, defaulting to 0
        plyCount: parseInt(headers['PlyCount'] as string, 10) || 0,
        eventDate: getDateValue(headers['EventDate']),
      };

      // STEP 2: Raw PGN (keep original PGN content or portion)
      const rawGames = pgnContent.trim();

      // STEP 3: Build move tree with FEN tracking
      const chess = new Chess(); // start from initial position
      const movesTree = buildMovesTreeWithFen(game.moves, chess);

      return {
        metadata: metadata,
        movesTree: movesTree,
        description: extractGameDescription(game),
        filename,
        pgnRaw: rawGames,
      };
    });
  } catch (error) {
    console.error('Error parsing Advanced PGN file:', error);
    throw new RpcException({
      status: 400,
      message: `Failed to parse Advanced PGN file: ${error.message}`,
    });
  }
};

/**
 * Extracts the general description of the game based on header or comments.
 */
const extractGameDescription = (game: any): string => {
  // If the game has a top-level comment (often a long annotation block), use it.
  if (Array.isArray(game.comments) && game.comments.length > 0) {
    // Top-level comments are usually objects with a 'text' property.
    return game.comments
      .map((c: any) => c.text?.trim())
      .filter(Boolean)
      .join('\n\n');
  }

  // Otherwise, fallback to the player names.
  const white = game.tags?.['White'] || '';
  const black = game.tags?.['Black'] || '';
  const result = game.tags?.['Result'] || '*';
  return `Game: ${white} - ${black} (${result})`;
};

/**
 * Recursively builds a nested move tree and tracks FEN before each move.
 */
const buildMovesTreeWithFen = (
  moves: any[],
  chess: Chess,
): AdvancedMovesTree[] => {
  if (!moves) return [];

  return moves.map((move: any) => {
    const comments: string[] = [];

    const extractComment = (commentField: any): string | null => {
      if (!commentField) return null;
      if (typeof commentField === 'string' && commentField.trim().length > 0) {
        return commentField.trim();
      }
      if (typeof commentField === 'object' && commentField.text) {
        return commentField.text.trim();
      }
      return null;
    };

    const diagComment = extractComment(move.commentDiag);
    if (diagComment) comments.push(diagComment);

    const simpleComment = extractComment(move.comment || move.commentAfter);
    if (simpleComment) comments.push(simpleComment);

    // Save FEN before the move
    const fenBefore = chess.fen();

    // --- Build move info safely ---
    const moveNotation = move.notation?.notation || move.move || '';
    const color = chess.turn() === 'w' ? 'w' : 'b';
    const moveNumber = move.notation?.moveNumber || chess.history().length + 1;
    const nags = (move.nags || []).map((n: any) => n.symbol || n);

    // Make the move (to advance board state for the MAIN LINE)
    try {
      chess.move(moveNotation);
    } catch {
      // ignore malformed moves
    }

    const moveNode: AdvancedMovesTree = {
      moveNumber,
      color,
      move: moveNotation,
      nags,
      comments,
      fenBefore,
      variations: [],
    };

    // Process variations (side lines)
    if (move.variations && move.variations.length > 0) {
      moveNode.variations = move.variations.map((variation: PgnMove[]) => {
        const chessCopy = new Chess(fenBefore);
        return buildMovesTreeWithFen(variation, chessCopy);
      });
    }

    return moveNode;
  });
};
