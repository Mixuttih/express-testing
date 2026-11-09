import express from 'express';
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/user-controller.js';
import authenticateToken, { authorizeUser } from '../middlewares/authentication.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:id', getUserById);
router.put('/:id', authenticateToken, authorizeUser, updateUser);
router.delete('/:id', authenticateToken, authorizeUser, deleteUser);

export default router;
