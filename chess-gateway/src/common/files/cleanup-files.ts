import * as fs from 'fs';

export const cleanupFiles = (files: Express.Multer.File[]): void => {
  if (!files || files.length === 0) return;

  for (const file of files) {
    if (!file?.path) continue;

    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      console.error(`Failed to delete file: ${file.path}`, err);
    }
  }
};
