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

export async function findUserByUsername(username) {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE username = ?', [
    username,
  ]);
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

export async function modifyUser(userData, id, user) {
  const fields = userFields.filter((field) => userData[field] !== undefined);
  if (fields.length === 0) {
    return false;
  }

  const values = fields.map((field) => userData[field]);
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  const isAdmin = user?.role === 'admin';
  const whereClause = isAdmin ? 'user_id = ?' : 'user_id = ? AND user_id = ?';
  const queryValues = isAdmin ? [...values, id] : [...values, id, user?.user_id];
  const [result] = await promisePool.execute(
    `UPDATE wsk_users SET ${assignments} WHERE ${whereClause}`,
    queryValues,
  );
  return result.affectedRows > 0;
}

export async function removeUser(id, user) {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();
    const isAdmin = user?.role === 'admin';
    const userWhereClause = isAdmin ? 'user_id = ?' : 'user_id = ? AND user_id = ?';
    const userValues = isAdmin ? [id] : [id, user?.user_id];
    const catWhereClause = isAdmin ? 'owner = ?' : 'owner = ? AND owner = ?';
    const catValues = isAdmin ? [id] : [id, user?.user_id];
    await connection.execute(`DELETE FROM wsk_cats WHERE ${catWhereClause}`, catValues);
    const [result] = await connection.execute(
      `DELETE FROM wsk_users WHERE ${userWhereClause}`,
      userValues,
    );
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
