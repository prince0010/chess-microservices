import * as fs from 'fs';
import * as path from 'path';
import * as pgnParser from 'pgn-parser';
import { RpcException } from '@nestjs/microservices';

import { ParsedAdvancedLesson } from 'src/modules/lesson/interfaces';

// ONLY PARSE pgnRaw
export const parseAdvancedPgnFile = (
  filename: string,
  filePath: string,
): any[] => {
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

    // Parse PGN file
    const parsedGames = pgnParser.parse(pgnContent);

    const rawGames = pgnContent.split(/\n\s*\n(?=\[Event\s)/g);

    return parsedGames.map((game: any, index: number) => {
      // STEP 1: Headers
      const headers = game.headers.reduce(
        (acc, { name, value }) => {
          acc[name] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      // STEP 2: Raw PGN
      const pgnRaw = rawGames[index] ? rawGames[index].trim() : pgnContent;

      // STEP 3: Description
      const description = headers['White']
        ? headers['White']
        : headers['Black']
          ? headers['Black']
          : 'No description available';

      return {
        description,
        filename,
        pgnRaw,
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
