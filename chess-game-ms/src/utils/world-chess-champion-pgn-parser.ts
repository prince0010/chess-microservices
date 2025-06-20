import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import * as pgnParser from 'pgn-parser';

export const parseWorldChessChampionsPgnFile = (filePath: string) => {
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
        description: game.comments?.[0]?.text.trim() || null, // Extract first comment as description
        moves: game.moves.map((move) => move.move).join(' '), // Store only the moves PGN notation
        pgnRaw, // Manually constructed PGN string
        fen: headers['FEN'] || null,
        event: headers['Event'] || '?',
        site: headers['Site'] || '?',
        date: headers['Date'] || '????.??.??',
        round: headers['Round'] || '?',
        white: headers['White'] || '?',
        black: headers['Black'] || '?',
        result: headers['Result'] || '*',
        setup: headers['SetUp'] || '0',
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
