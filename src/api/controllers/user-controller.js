import {
  createUser,
  findUserById,
  findUserByUsername,
  getAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';

export async function getUsers(_req, res) {
  res.json(await getAllUsers());
}

export async function addUser(req, res) {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const newUser = await createUser(req.body);
  if (!newUser) {
    return res.status(400).json({ message: 'User data is required.' });
  }
  res.status(201).json(newUser);
}

export async function getUserById(req, res) {
  const foundUser = await findUserById(Number(req.params.id));

  if (!foundUser) {
    return res.sendStatus(404);
  }

  res.json(foundUser);
}

export async function getUserByUsername(req, res) {
  const foundUser = await findUserByUsername(req.params.username);

  if (!foundUser) {
    return res.sendStatus(404);
  }

  res.json(foundUser);
}

export async function updateUser(req, res) {
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
}

export async function deleteUser(req, res) {
  if (!(await removeUser(Number(req.params.id), res.locals.user))) {
    return res.sendStatus(404);
  }
  res.json({ message: 'User item deleted.' });
}
