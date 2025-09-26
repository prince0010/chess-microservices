import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as pgnParser from 'pgn-parser';

import { LessonParent } from 'src/modules/lesson/entities/lesson-parent.entity';
import { extractHintsFromComments } from './extractHintsFromComments';

// traditional with not hint
export const parseNormalPgnFile = (
  filePath: string,
  lessonParent: LessonParent,
) => {
  try {
    const fullPath = path.resolve(filePath);
    let pgnContent = fs.readFileSync(fullPath, 'utf-8');
    if (!pgnContent) {
      throw new BadRequestException(
        `No PGN File found in fs with that path: ${filePath}`,
      );
    }

    // Remove UTF-8 BOM if present
    if (pgnContent.charCodeAt(0) === 0xfeff) {
      pgnContent = pgnContent.slice(1);
    }

    // Parse PGN file
    const parsedGames = pgnParser.parse(pgnContent);

    return parsedGames.map((game: any) => {
      // Convert headers array to an object for easier access
      const headers = game.headers.reduce(
        (acc, { name, value }) => {
          acc[name] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      // ==================== OLD SOLUTION ====================
      // // Construct the PGN headers
      // const headerSection = game.headers
      //   .map(({ name, value }) => `[${name} "${value}"]`)
      //   .join('\n');

      // // Construct the moves section
      // let movesSection = '';
      // let moveNumber = 1;
      // for (let i = 0; i < game.moves.length; i += 2) {
      //   const whiteMove = game.moves[i]?.move || '';
      //   const blackMove = game.moves[i + 1]?.move || '';
      //   movesSection += `${moveNumber}. ${whiteMove} ${blackMove} `;
      //   moveNumber++;
      // }

      // // Construct the final PGN string
      // const pgnRaw = `${headerSection}\n\n${movesSection}${game.result}`;

      // ==================== NEW SOLUTION => THE SAME AS PARSE WITH HINTS ====================
      // Collect ALL comments from both game and moves
      const allComments: any[] = [];

      // 1. Add game-level comments if they exist
      if (Array.isArray(game.comments)) {
        allComments.push(...game.comments);
      }

      // 2. Add move-level comments
      game.moves?.forEach((move: any) => {
        if (Array.isArray(move.comments)) {
          allComments.push(...move.comments);
        }
      });

      // Extract description from different scenarios
      const description = extractCompleteDescription(
        allComments,
        headers['White'],
      );

      // Extract hints from all comments
      const hints = extractHintsFromComments(allComments);

      // Build PGN string
      const headerSection = game.headers
        .map(({ name, value }: any) => `[${name} "${value}"]`)
        .join('\n');

      let movesSection = '';
      let moveNumber = 1;
      for (let i = 0; i < game.moves.length; i += 2) {
        const whiteMove = game.moves[i]?.move || '';
        const blackMove = game.moves[i + 1]?.move || '';
        movesSection += `${moveNumber}. ${whiteMove} ${blackMove} `;
        moveNumber++;
      }

      return {
        level: lessonParent.level,
        timer: lessonParent.timer,
        story: lessonParent.story,
        description,
        // description:
        //   game.comments?.[0]?.text.trim() || 'No description available', // Extract first comment as description
        moves: game.moves.map((move) => move.move).join(' '), // Store only the moves PGN notation
        // pgnRaw, // Manually constructed PGN string
        pgnRaw: `${headerSection}\n\n${movesSection}${game.result}`,
        fen: headers['FEN'] || '',
        points: lessonParent.pointsPerLesson,
        event: headers['Event'] || '?',
        site: headers['Site'] || '?',
        date: headers['Date'] || '????.??.??',
        round: headers['Round'] || '?',
        white: headers['White'] || '?',
        black: headers['Black'] || '?',
        result: headers['Result'] || '*',
        setup: headers['SetUp'] || '1',
        plyCount: parseInt(headers['PlyCount'], 10) || 0,
        hints,
        lessonParent,
      };
    });
  } catch (error) {
    throw new RpcException({
      status: 400,
      message: error.message,
    });
  }
};

// with hint
export const parseHintPgnFile = (
  filePath: string,
  lessonParent: LessonParent,
) => {
  try {
    const fullPath = path.resolve(filePath);
    let pgnContent = fs.readFileSync(fullPath, 'utf-8');
    if (!pgnContent) {
      throw new BadRequestException(`No PGN File found at: ${filePath}`);
    }

    // Remove UTF-8 BOM if present
    if (pgnContent.charCodeAt(0) === 0xfeff) {
      pgnContent = pgnContent.slice(1);
    }

    const parsedGames = pgnParser.parse(pgnContent);

    return parsedGames.map((game: any) => {
      const headers = game.headers.reduce(
        (acc, { name, value }) => ({ ...acc, [name]: value }),
        {} as Record<string, string>,
      );

      // Collect ALL comments from both game and moves
      const allComments: any[] = [];

      // 1. Add game-level comments if they exist
      if (Array.isArray(game.comments)) {
        allComments.push(...game.comments);
      }

      // 2. Add move-level comments
      game.moves?.forEach((move: any) => {
        if (Array.isArray(move.comments)) {
          allComments.push(...move.comments);
        }
      });

      // Extract description from different scenarios
      const description = extractCompleteDescription(
        allComments,
        headers['White'],
      );

      // Extract hints from all comments
      const hints = extractHintsFromComments(allComments);

      // Build PGN string
      const headerSection = game.headers
        .map(({ name, value }: any) => `[${name} "${value}"]`)
        .join('\n');

      let movesSection = '';
      let moveNumber = 1;
      for (let i = 0; i < game.moves.length; i += 2) {
        const whiteMove = game.moves[i]?.move || '';
        const blackMove = game.moves[i + 1]?.move || '';
        movesSection += `${moveNumber}. ${whiteMove} ${blackMove} `;
        moveNumber++;
      }

      return {
        level: lessonParent.level,
        timer: lessonParent.timer,
        story: lessonParent.story,
        description,
        moves: game.moves.map((move: any) => move.move).join(' '),
        pgnRaw: `${headerSection}\n\n${movesSection}${game.result}`,
        fen: headers['FEN'] || '',
        points: lessonParent.pointsPerLesson,
        event: headers['Event'] || '?',
        site: headers['Site'] || '?',
        date: headers['Date'] || '????.??.??',
        round: headers['Round'] || '?',
        white: headers['White'] || '?',
        black: headers['Black'] || '?',
        result: headers['Result'] || '*',
        setup: headers['SetUp'] || '1',
        plyCount: parseInt(headers['PlyCount'], 10) || 0,
        showHint: true,
        hints,
        lessonParent,
      };
    });
  } catch (error) {
    throw new RpcException({
      status: 400,
      message: error.message,
    });
  }
};

const extractCompleteDescription = (
  comments: any[] = [],
  headersWhite: any,
): string => {
  if (!comments.length) {
    return headersWhite && headersWhite !== '?'
      ? headersWhite
      : 'No description available';
  }

  // Process each comment individually
  const descriptionParts = comments
    .map((comment) => {
      if (!comment.text) return '';

      const text = comment.text.trim();

      // Case 1: Pure text comment
      if (!text.includes('[%')) return text;

      // Case 2: ChessBase-style comment
      const lastBracket = text.lastIndexOf(']');
      if (lastBracket > 0) {
        return text.slice(lastBracket + 1).trim();
      }

      return '';
    })
    .filter((text) => text); // Remove empty strings

  // Combine with paragraph breaks
  return descriptionParts.join('\n\n') || 'No description available';
};
