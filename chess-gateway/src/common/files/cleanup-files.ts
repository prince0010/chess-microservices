import * as fs from 'fs';

export const cleanupFiles = (files: Express.Multer.File[]): void => {
  if (!files || files.length === 0) return;

  for (const file of files) {
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${file.path}`, err);
        }
      });
    }
  }
};
