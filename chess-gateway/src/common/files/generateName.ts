export const generateName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const fileExtension = file.originalname.split('.').pop() || 'file';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const nameGenerated = `teacher-file-${timestamp}-${random}.${fileExtension}`;

  return callback(null, nameGenerated);
};
