import { BadRequestException } from '@nestjs/common';

export const myFileFilter = (
  req: Express.Request,
  files: Express.Multer.File,
  callback: Function,
) => {
  if (!files) return callback(new BadRequestException('Missing files'), false);

  const fileExtension = files.mimetype.split('/')[1];

  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(files.mimetype)) {
    return callback(null, true);
  }

  return callback(
    new BadRequestException(
      `Extension ${fileExtension} not allowed, use only these: [${allowedMimeTypes}]`,
    ),
    false,
  );
};
