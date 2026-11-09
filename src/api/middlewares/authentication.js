import jwt from 'jsonwebtoken';
import { findCatById } from '../models/cat-model.js';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  const authHeader = req.get('authorization');
  const [scheme, token] = authHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Bearer token is required.' });
  }

  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const getAuthenticatedUserId = (res) => Number(res.locals.user?.user_id);
const isAdmin = (res) => res.locals.user?.role === 'admin';

const authorizeUser = (req, res, next) => {
  const authenticatedUserId = getAuthenticatedUserId(res);
  const requestedUserId = Number(req.params.id);

  if (
    !isAdmin(res) &&
    (!Number.isInteger(authenticatedUserId) || authenticatedUserId !== requestedUserId)
  ) {
    return res.status(403).json({ message: 'You can only modify your own user account.' });
  }

  next();
};

const authorizeCatOwner = async (req, res, next) => {
  const cat = await findCatById(Number(req.params.id));
  if (!cat) {
    return res.sendStatus(404);
  }

  if (!isAdmin(res) && Number(cat.owner) !== getAuthenticatedUserId(res)) {
    return res.status(403).json({ message: 'Only the cat owner can modify this cat.' });
  }

  next();
};

export default authenticateToken;
export { authenticateToken, authorizeCatOwner, authorizeUser };
