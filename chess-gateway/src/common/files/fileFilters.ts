import { BadRequestException } from '@nestjs/common';

export const myFileFilter = (
  req: Express.Request,
  files: Express.Multer.File,
  callback: Function,
) => {
  if (!files) return callback(new BadRequestException('Imagen falta'), false);

  const fileExtension = files.mimetype.split('/')[1];

  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(files.mimetype)) {
    return callback(null, true);
  }

  return callback(
    new BadRequestException(
      `La extensión ${fileExtension} no es permitida, solo estas [${allowedMimeTypes}]`,
    ),
    false,
  );
};
