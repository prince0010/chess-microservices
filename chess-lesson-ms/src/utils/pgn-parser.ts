import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as pgnParser from 'pgn-parser';
import { LessonDefaultPoints } from 'src/enum';

export const parsePgnFile = (filePath: string, levelName: string) => {
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
      };
    });
  } catch (error) {
    throw new RpcException({
      status: 400,
      message: error.message,
    });
  }
};
