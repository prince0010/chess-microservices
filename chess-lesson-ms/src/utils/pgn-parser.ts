import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as pgnParser from 'pgn-parser';

import { LessonParent } from 'src/modules/lesson/entities/lesson-parent.entity';
import { extractHintsFromComments } from './extractHintsFromComments';

import { LessonDefaultPoints } from 'src/enum';

// traditional with not hint
export const parseNormalPgnFile = (
  filePath: string,
  levelName: string,
  lessonParent: LessonParent,
) => {
  try {
    const fullPath = path.resolve(filePath);
    const pgnContent = fs.readFileSync(fullPath, 'utf-8');
    if (!pgnContent) {
      throw new BadRequestException(
        `No PGN File found in fs with that path: ${filePath}`,
      );
    }

    // Parse PGN file
    const parsedGames = pgnParser.parse(pgnContent);
    let points: number = LessonDefaultPoints.POINTS_PER_LESSON; // changeMe! to find a better balance

    return parsedGames.map((game: any) => {
      points += 4; // each lesson give more points

      // Convert headers array to an object for easier access
      const headers = game.headers.reduce(
        (acc, { name, value }) => {
          acc[name] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      // Construct the PGN headers
      const headerSection = game.headers
        .map(({ name, value }) => `[${name} "${value}"]`)
        .join('\n');

      // Construct the moves section
      let movesSection = '';
      let moveNumber = 1;
      for (let i = 0; i < game.moves.length; i += 2) {
        const whiteMove = game.moves[i]?.move || '';
        const blackMove = game.moves[i + 1]?.move || '';
        movesSection += `${moveNumber}. ${whiteMove} ${blackMove} `;
        moveNumber++;
      }

      // Construct the final PGN string
      const pgnRaw = `${headerSection}\n\n${movesSection}${game.result}`;

      return {
        level: levelName,
        description:
          game.comments?.[0]?.text.trim() || 'No description available', // Extract first comment as description
        moves: game.moves.map((move) => move.move).join(' '), // Store only the moves PGN notation
        pgnRaw, // Manually constructed PGN string
        fen: headers['FEN'] || '',
        points,
        event: headers['Event'] || '?',
        site: headers['Site'] || '?',
        date: headers['Date'] || '????.??.??',
        round: headers['Round'] || '?',
        white: headers['White'] || '?',
        black: headers['Black'] || '?',
        result: headers['Result'] || '*',
        setup: headers['SetUp'] || '1',
        plyCount: parseInt(headers['PlyCount'], 10) || 0,
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
  levelName: string,
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

    const parsedGames = pgnParser.parse(pgnContent);

    return parsedGames.map((game: any) => {
      const headers = game.headers.reduce(
        (acc, { name, value }) => {
          acc[name] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const headerSection = game.headers
        .map(({ name, value }) => `[${name} "${value}"]`)
        .join('\n');

      let movesSection = '';
      let moveNumber = 1;
      for (let i = 0; i < game.moves.length; i += 2) {
        const whiteMove = game.moves[i]?.move || '';
        const blackMove = game.moves[i + 1]?.move || '';
        movesSection += `${moveNumber}. ${whiteMove} ${blackMove} `;
        moveNumber++;
      }

      const pgnRaw = `${headerSection}\n\n${movesSection}${game.result}`;

      // Extract description and comments
      const allComments = Array.isArray(game.comments)
        ? game.comments
            .filter((c) => typeof c?.text === 'string')
            .map((c) => c.text.trim())
        : [];
      const description =
        allComments.find((c) => !c.startsWith('[%')) ||
        'No description available';

      // extract hints
      const hints = extractHintsFromComments(game.comments);

      return {
        level: levelName,
        description,
        moves: game.moves.map((move) => move.move).join(' '),
        pgnRaw,
        fen: headers['FEN'] || '',
        points: 5,
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
        hints, // JSON object containing squares and arrows
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
