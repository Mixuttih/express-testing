import express from 'express';
import {
  addCat,
  deleteCat,
  getCatById,
  getCats,
  updateCat,
} from '../controllers/cat-controller.js';

const router = express.Router();

router.get('/', getCats);
router.post('/', addCat);
router.get('/:id', getCatById);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
