import {
  createUser,
  findUserById,
  findUserByUsername,
  getAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';

export async function getUsers(_req, res, next) {
  try {
    res.json(await getAllUsers());
  } catch (error) {
    next(error);
  }
}

export async function addUser(req, res, next) {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const newUser = await createUser(req.body);
    if (!newUser) {
      return res.status(400).json({ message: 'User data is required.' });
    }
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const foundUser = await findUserById(Number(req.params.id));

    if (!foundUser) {
      return res.sendStatus(404);
    }

    res.json(foundUser);
  } catch (error) {
    next(error);
  }
}

export async function getUserByUsername(req, res, next) {
  try {
    const foundUser = await findUserByUsername(req.params.username);

    if (!foundUser) {
      return res.sendStatus(404);
    }

    res.json(foundUser);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const updates = { ...req.body };
    if (res.locals.user.role !== 'admin') {
      delete updates.role;
    }

    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }

    if (!(await modifyUser(updates, Number(req.params.id), res.locals.user))) {
      return res.sendStatus(404);
    }
    res.json({ message: 'User item updated.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (!(await removeUser(Number(req.params.id), res.locals.user))) {
      return res.sendStatus(404);
    }
    res.json({ message: 'User item deleted.' });
  } catch (error) {
    next(error);
  }
}
