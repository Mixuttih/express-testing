import sharp from 'sharp';
import path from 'node:path';

async function createThumbnail(req, res, next) {
  if (!req.file) {
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
