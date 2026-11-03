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

const router = express.Router();

router.get('/', logger, requestTime, getCats);
router.post('/', addCat);
router.get('/:id', getCatById);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
