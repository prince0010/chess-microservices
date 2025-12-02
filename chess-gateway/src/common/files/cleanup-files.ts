import * as fs from 'fs';

export const cleanupFiles = (files: Express.Multer.File[]): void => {
  if (!files || files.length === 0) return;

  for (const file of files) {
    if (!file?.path) continue;

    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      // ignore here the log
      // console.error(`Failed to delete file: ${file.path}`, err);
    }
  }
};
