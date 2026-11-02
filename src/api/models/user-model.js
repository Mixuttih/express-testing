const users = [
  {
     user_id: 3609,
     name: 'John Doe',
     username: 'johndoe',
     email: 'john@metropolia.fi',
     role: 'user',
     password: 'password',
  },
  {
     user_id: 3610,
     name: 'Jane Smith',
     username: 'janesmith',
     email: 'jane@metropolia.fi',
     role: 'user',
     password: 'password',
  }
]

export function getAllUsers() {
  return users;
}

export function findUserById(id) {
  return users.find((user) => user.user_id === id);
}

export function createUser(userData) {
  const newUser = {
    user_id: Math.max(...users.map((user) => user.user_id)) + 1,
    ...userData,
  };

  users.push(newUser);
  return newUser;
}
