import promisePool from '../../utils/database.js';

const userFields = ['name', 'username', 'email', 'role', 'password'];

export async function getAllUsers() {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  return rows;
}

export async function findUserById(id) {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE user_id = ?', [id]);
  return rows[0] ?? false;
}

export async function createUser(userData) {
  const fields = userFields.filter((field) => userData[field] !== undefined);
  const values = fields.map((field) => userData[field]);

  if (fields.length === 0) {
    return false;
  }

  const placeholders = fields.map(() => '?').join(', ');
  const [result] = await promisePool.execute(
    `INSERT INTO wsk_users (${fields.join(', ')}) VALUES (${placeholders})`,
    values,
  );
  return { user_id: result.insertId, ...userData };
}

export async function modifyUser(userData, id) {
  const fields = userFields.filter((field) => userData[field] !== undefined);
  if (fields.length === 0) {
    return false;
  }

  const values = fields.map((field) => userData[field]);
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  const [result] = await promisePool.execute(
    `UPDATE wsk_users SET ${assignments} WHERE user_id = ?`,
    [...values, id],
  );
  return result.affectedRows > 0;
}

export async function removeUser(id) {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);
    const [result] = await connection.execute('DELETE FROM wsk_users WHERE user_id = ?', [id]);
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
