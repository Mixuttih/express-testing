import express from 'express';
import {
  addCat,
  deleteCat,
  getCatById,
  getCats,
  updateCat,
} from '../controllers/cat-controller.js';
import logger from '../middlewares/logger.js';
import requestTime from '../middlewares/request-time.js';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomBytes(16).toString('hex')}${extension}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', logger, requestTime, getCats);
router.post('/', upload.single('cat'), addCat);
router.get('/:id', getCatById);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
