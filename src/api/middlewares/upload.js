import crypto from 'node:crypto';
import sharp from 'sharp';
import path from 'node:path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomBytes(16).toString('hex')}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    callback(null, true);
    return;
  }

  const error = new Error('Only image or video files are allowed.');
  error.status = 400;
  callback(error);
};

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    error.status = 400;
    error.message =
      error.code === 'LIMIT_FILE_SIZE' ? 'File must be no larger than 10 MB.' : error.message;
  }
  next(error);
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

export { handleUploadError };

async function createThumbnail(req, res, next) {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    next();
    return;
  }

  const { dir, name, ext } = path.parse(req.file.path);
  const thumbnailPath = path.join(dir, `${name}_thumb${ext}`);

  try {
    await sharp(req.file.path)
      .resize({ width: 160, height: 160, fit: 'fill' })
      .toFile(thumbnailPath);

    req.file.thumbnailFilename = `${name}_thumb${ext}`;
    req.file.thumbnailPath = thumbnailPath;
    next();
  } catch (error) {
    next(error);
  }
}

export default createThumbnail;
