import {
  createUser,
  findUserById,
  getAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

export async function getUsers(_req, res) {
  res.json(await getAllUsers());
}

export async function addUser(req, res) {
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

export async function updateUser(req, res) {
  if (!(await modifyUser(req.body, Number(req.params.id)))) {
    return res.sendStatus(404);
  }
  res.json({ message: 'User item updated.' });
}

export async function deleteUser(req, res) {
  if (!(await removeUser(Number(req.params.id)))) {
    return res.sendStatus(404);
  }
  res.json({ message: 'User item deleted.' });
}
