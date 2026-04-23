import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `audio-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /wav|mp3|ogg|webm|m4a|flac/i;
  if (allowed.test(path.extname(file.originalname)) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only audio files are allowed', 400));
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });
