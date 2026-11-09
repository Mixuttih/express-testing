import express from 'express';
import {
  addCat,
  deleteCat,
  getCatById,
  getCats,
  getCatsByUser,
  updateCat,
} from '../controllers/cat-controller.js';
import logger from '../middlewares/logger.js';
import requestTime from '../middlewares/request-time.js';
import createThumbnail, { handleUploadError, upload } from '../middlewares/upload.js';
import authenticateToken, { authorizeCatOwner } from '../middlewares/authentication.js';
import { body } from 'express-validator';
import { validationErrors } from '../middlewares/error-handlers.js';

const router = express.Router();

router.get('/', logger, requestTime, getCats);
router.post(
  '/',
  authenticateToken,
  upload.single('cat'),
  handleUploadError,
  body('cat_name').trim().notEmpty().isLength({ min: 3, max: 50 }),
  body('weight').notEmpty().isFloat(),
  body('owner')
    .customSanitizer((value, { req }) => value ?? req.res.locals.user.user_id)
    .notEmpty()
    .isInt(),
  body('birthdate').notEmpty().isISO8601(),
  body('file')
    .custom((_value, { req }) => Boolean(req.file))
    .withMessage('File is required.'),
  validationErrors,
  createThumbnail,
  addCat,
);
router.get('/user/:userId', getCatsByUser);
router.get('/:id', getCatById);
router.put('/:id', authenticateToken, authorizeCatOwner, updateCat);
router.delete('/:id', authenticateToken, authorizeCatOwner, deleteCat);

export default router;
