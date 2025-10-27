import * as path from 'path';
import * as fs from 'fs';
import { RpcException } from '@nestjs/microservices';
import { GameComment, PgnMove } from '@mliebelt/pgn-types';
import * as mliebelt from '@mliebelt/pgn-parser';
import { Chess } from 'chess.js';

import {
  AdvancedMovesTree,
  IAdvancedLessonSeed,
  MetadataAdvancedLesson,
  ParsedAdvancedLesson,
} from 'src/modules/lesson/interfaces';

/**
 * Parses a complex PGN file into a structured format with FEN tracking.
 */
export const parseAdvancedPgnFile = (
  item: IAdvancedLessonSeed,
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
        fen: headers['FEN'] || '?',
        black: headers['Black'] || '?',
        result: headers['Result'] || '*',
        eco: headers['ECO'] || '',
        annotator: headers['Annotator'] || '',
        // Ensure PlyCount is parsed as a number, defaulting to 0
        plyCount: parseInt(headers['PlyCount'] as string, 10) || 0,
        eventDate: getDateValue(headers['EventDate']),
      };

      // STEP 2: Raw PGN (keep original PGN content or portion) not used at the moment
      const rawGames = pgnContent.trim();

      // STEP 3: Build move tree with FEN tracking
      const chess = new Chess();
      const headerFen =
        metadata.fen && metadata.fen !== '?' ? metadata.fen : undefined;
      safeLoadFen(chess, headerFen);
      const movesTree = buildMovesTreeWithFen(game.moves, chess);

      // STEP 4: description and hints
      const { description, hints } = extractGameDescription(
        game.gameComment,
        metadata,
      );
      metadata.hints = hints;

      return {
        metadata,
        movesTree,
        description,
        // pgnRaw: rawGames,
        pgnRaw: 'not-used-at-the-moment',
        ...item,
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

const extractGameDescription = (
  gameComment: GameComment | undefined,
  metadata: MetadataAdvancedLesson,
): any => {
  if (!gameComment?.comment || gameComment.comment === '[#]') {
    return {
      description: `${metadata.white} vs ${metadata.black}`,
      hints: { squares: [], arrows: [] },
    };
  }

  return {
    description: gameComment.comment,
    hints: extractHints(gameComment),
  };
};

const extractHints = (
  gameComment: GameComment,
): { squares: string[]; arrows: string[] } => {
  if (!gameComment) {
    return { squares: [], arrows: [] };
  }

  const hints = {
    squares: [] as string[],
    arrows: [] as string[],
  };

  // Extract colored squares (highlighted squares)
  if (gameComment.colorFields && Array.isArray(gameComment.colorFields)) {
    hints.squares = gameComment.colorFields
      .map((field: string) => {
        // Remove the 'G' prefix if present (e.g., "Gc7" -> "c7")
        if (field.startsWith('G')) {
          return field.substring(1);
        }
        return field;
      })
      .filter((field: string) => isValidSquare(field));
  }

  // Extract colored arrows
  if (gameComment.colorArrows && Array.isArray(gameComment.colorArrows)) {
    hints.arrows = gameComment.colorArrows
      .map((arrow: string) => {
        // Remove the 'G' prefix if present (e.g., "Gh2c7" -> "h2c7")
        if (arrow.startsWith('G')) {
          return arrow.substring(1);
        }
        return arrow;
      })
      .filter((arrow: string) => isValidArrow(arrow));
  }

  return hints;
};

const isValidSquare = (square: string): boolean => {
  if (square.length !== 2) return false;

  const file = square[0];
  const rank = square[1];

  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
};

const isValidArrow = (arrow: string): boolean => {
  if (arrow.length !== 4) return false;

  const fromSquare = arrow.substring(0, 2);
  const toSquare = arrow.substring(2, 4);

  return isValidSquare(fromSquare) && isValidSquare(toSquare);
};

const safeLoadFen = (chess: Chess, fen: string | undefined): boolean => {
  if (!fen || fen === '?' || fen.toLowerCase() === 'start') return false;
  try {
    const normalized = fen.trim();
    // try loading; chess.load throws on invalid FEN
    chess.load(normalized);
    return true;
  } catch (err) {
    chess.reset();
    return false;
  }
};

/**
 * Robust move-tree builder:
 * - uses the provided chess instance (which may already contain a FEN)
 * - records fenBefore before attempting each move
 * - attempts to apply SAN using chess.move(san, { sloppy: true }) for more tolerant parsing
 * - builds variations by copying the FEN BEFORE the variation branch
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

    // prefer SAN from parser notation if available (notation.notation holds SAN-like string)
    const moveNotation = move.notation?.notation || move.move || '';
    const color = chess.turn() === 'w' ? 'w' : 'b';

    const moveNumber = Math.floor(chess.history().length / 2) + 1;
    const nags = (move.nags || []).map((n: any) => n.symbol || n);

    // other possible solution - Rely on chess.js history
    // const moveNumber = Math.floor(chess.history().length / 2) + 1; // <--- Rely on chess.js history
    // const color = chess.turn() === 'w' ? 'w' : 'b';
    // const nags = (move.nags || []).map((n: any) => n.symbol || n);

    // Try to make the move on the mainline chess instance so subsequent fenBefore are correct.
    // Use sloppy parsing to accept various SAN variants.
    let appliedSuccessfully = false;
    try {
      // chess.move returns null if the move is illegal
      const result = chess.move(moveNotation, { sloppy: true } as any);
      appliedSuccessfully = !!result;
    } catch (err) {
      appliedSuccessfully = false;
    }

    // If move failed, attempt common fallbacks:
    if (!appliedSuccessfully) {
      // 1) If it looks like a promotion without = (e.g. 'e8Q'), try explicit promotion
      try {
        const promotionMatch = /([a-h][1-8])([QRNB])$/i.exec(moveNotation);
        if (promotionMatch) {
          const sanWithEq = promotionMatch
            ? `${promotionMatch[1]}=${promotionMatch[2].toUpperCase()}`
            : moveNotation;
          const res2 = chess.move(sanWithEq, { sloppy: true } as any);
          appliedSuccessfully = !!res2;
        }
      } catch {}
    }

    const moveNode: AdvancedMovesTree = {
      moveNumber,
      color,
      move: moveNotation,
      nags,
      comments,
      fenBefore,
      variations: [],
      // optionally expose a flag to identify parsing/application issues
      invalidDuringParse: !appliedSuccessfully,
    };

    // Process variations (side lines). Each variation uses a fresh chess copy starting at fenBefore
    if (move.variations && move.variations.length > 0) {
      moveNode.variations = move.variations.map((variation: PgnMove[]) => {
        const chessCopy = new Chess(fenBefore);
        return buildMovesTreeWithFen(variation, chessCopy);
      });
    }

    return moveNode;
  });
};

// /**
//  * OLD Recursively builds a nested move tree and tracks FEN before each move.
//  */
// const buildMovesTreeWithFen = (
//   moves: any[],
//   chess: Chess,
// ): AdvancedMovesTree[] => {
//   if (!moves) return [];

//   return moves.map((move: any) => {
//     const comments: string[] = [];

//     const extractComment = (commentField: any): string | null => {
//       if (!commentField) return null;
//       if (typeof commentField === 'string' && commentField.trim().length > 0) {
//         return commentField.trim();
//       }
//       if (typeof commentField === 'object' && commentField.text) {
//         return commentField.text.trim();
//       }
//       return null;
//     };

//     const diagComment = extractComment(move.commentDiag);
//     if (diagComment) comments.push(diagComment);

//     const simpleComment = extractComment(move.comment || move.commentAfter);
//     if (simpleComment) comments.push(simpleComment);

//     // Save FEN before the move
//     const fenBefore = chess.fen();

//     // --- Build move info safely ---
//     const moveNotation = move.notation?.notation || move.move || '';
//     const color = chess.turn() === 'w' ? 'w' : 'b';
//     const moveNumber = move.notation?.moveNumber || chess.history().length + 1;
//     const nags = (move.nags || []).map((n: any) => n.symbol || n);

//     // Make the move (to advance board state for the MAIN LINE)
//     try {
//       chess.move(moveNotation);
//     } catch {
//       // ignore malformed moves
//     }

//     const moveNode: AdvancedMovesTree = {
//       moveNumber,
//       color,
//       move: moveNotation,
//       nags,
//       comments,
//       fenBefore,
//       variations: [],
//     };

//     // Process variations (side lines)
//     if (move.variations && move.variations.length > 0) {
//       moveNode.variations = move.variations.map((variation: PgnMove[]) => {
//         const chessCopy = new Chess(fenBefore);
//         return buildMovesTreeWithFen(variation, chessCopy);
//       });
//     }

//     return moveNode;
//   });
// };
