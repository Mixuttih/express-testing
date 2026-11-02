import express from 'express';
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
