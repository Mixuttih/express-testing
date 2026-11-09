import express from 'express';
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/user-controller.js';
import authenticateToken, { authorizeUser } from '../middlewares/authentication.js';
import {body} from 'express-validator';
import {validationErrors} from '../middlewares/error-handlers.js';

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(
    body('email').trim().isEmail(),
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8}),
    validationErrors,
    addUser
  );
router.get('/:id', getUserById);
router.put('/:id', authenticateToken, authorizeUser, updateUser);
router.delete('/:id', authenticateToken, authorizeUser, deleteUser);



export default router;
