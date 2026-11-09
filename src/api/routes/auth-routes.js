import express from 'express';
import { postLogin, getMe } from '../controllers/auth-controller.js';
import authenticateToken from '../middlewares/authentication.js';

const router = express.Router();

router.post('/login', postLogin);
router.get('/me', authenticateToken, getMe);

export default router;
