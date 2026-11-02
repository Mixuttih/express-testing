import { createUser, findUserById, getAllUsers } from '../models/user-model.js';

export function getUsers(req, res) {
  res.json(getAllUsers());
}

export function addUser(req, res) {
  const newUser = createUser(req.body);
  res.status(201).json(newUser);
}

export function getUserById(req, res) {
  const userId = Number(req.params.id);
  const foundUser = findUserById(userId);

  if (!foundUser) {
    return res.sendStatus(404);
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${foundUser.name}</title>
      </head>
      <body>
        <main>
          <h1>${foundUser.name}</h1>
          <p>Username: ${foundUser.username}</p>
          <p>Email: ${foundUser.email}</p>
          <p>Role: ${foundUser.role}</p>
          <p>Password: ${foundUser.password}</p>
        </main>
      </body>
    </html>
  `);
}

export function updateUser(req, res) {
  res.json({ message: 'User item updated.' });
}

export function deleteUser(req, res) {
  res.json({ message: 'User item deleted.' });
}
