export const generateName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const fileExtension = file.originalname.split('.').pop() || 'file';
  const imageExtensions = ['jpeg', 'jpg', 'png', 'webp'];

  const setImage = imageExtensions.some((extension) =>
    fileExtension.includes(extension),
  );
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const nameGenerated = `teacher-${setImage ? 'photo' : 'file'}-${timestamp}-${random}.${fileExtension}`;

  return callback(null, nameGenerated);
};
