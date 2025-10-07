import * as fs from 'fs';
import * as path from 'path';
import { RpcException } from '@nestjs/microservices';
import * as mliebelt from '@mliebelt/pgn-parser';
import { PgnMove } from '@mliebelt/pgn-types';

import {
  AdvancedMovesTree,
  ParsedAdvancedLesson,
} from 'src/modules/lesson/interfaces';

/**
 * Parses a complex PGN file...
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

    // console.log('parsed file from mliebelt package: ', parsed[0]);

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
      // ---------------------------------------------

      // Build move tree recursively
      const movesTree = buildMovesTree(game.moves);

      // ✅ Serialize the result so it can be saved safely to DB
      return {
        metadata: metadata,
        movesTree: movesTree,
        description: extractGameDescription(game),
        filename,
      };
    });
  } catch (error) {
    console.error('Error parsing PGN file:', error);
    throw new RpcException({
      status: 400,
      message: `Failed to parse PGN file: ${error.message}`,
    });
  }
};

/**
 * Recursively builds a nested move tree.
 * The focus is on correctly extracting comments and maintaining the move order.
 */
const buildMovesTree = (moves: any[]): AdvancedMovesTree[] => {
  if (!moves) return [];

  return moves.map((move: any) => {
    const comments: string[] = [];

    const extractComment = (commentField: any): string | null => {
      if (!commentField) return null;

      // 1. Check if it's a simple string (most common case for comments)
      if (typeof commentField === 'string' && commentField.trim().length > 0) {
        return commentField.trim();
      }

      // 2. Handle it if it's an object with a 'text' property (sometimes used for complex comments)
      if (typeof commentField === 'object' && commentField.text) {
        return commentField.text.trim();
      }

      return null;
    };

    // 1. Check for comment *before* the move (commentDiag)
    const diagComment = extractComment(move.commentDiag);
    if (diagComment) {
      comments.push(diagComment);
    }

    // 2. Check for comment *after* the move (simple move annotation - might be 'comment' or 'commentAfter')
    const simpleComment = extractComment(move.comment || move.commentAfter);
    if (simpleComment) {
      comments.push(simpleComment);
    }

    const moveNode: AdvancedMovesTree = {
      // The moveNumber is null for Black's move if not explicitly noted
      moveNumber: move.moveNumber || null,
      color: move.turn || null, // 'w' or 'b'
      move: move.notation?.notation || move.move || '',

      comments: comments, // Use the extracted and cleaned comments array
      nags: move.nag || [],

      // Variations is an array of move lists (PgnMove[][])
      variations: (move.variations || []).map((variation: PgnMove[]) =>
        buildMovesTree(variation),
      ),
    };

    return moveNode;
  });
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
