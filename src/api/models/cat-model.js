import promisePool from '../../utils/database.js';

const catFields = ['cat_name', 'weight', 'owner', 'filename', 'birthdate'];

const catSelect = `
  SELECT c.*, u.name AS owner_name
  FROM wsk_cats c
  LEFT JOIN wsk_users u ON u.user_id = c.owner
`;

export async function getAllCats() {
  const [rows] = await promisePool.query(`${catSelect} ORDER BY c.cat_id`);
  return rows;
}

export async function getCatsByUserId(userId) {
  const [rows] = await promisePool.execute(`${catSelect} WHERE c.owner = ? ORDER BY c.cat_id`, [
    userId,
  ]);
  return rows;
}

export async function findCatById(id) {
  const [rows] = await promisePool.execute(`${catSelect} WHERE c.cat_id = ?`, [id]);
  return rows[0] ?? false;
}

export async function createCat(cat) {
  const data = {
    cat_name: cat.cat_name ?? cat.name,
    weight: cat.weight,
    owner: cat.owner ?? cat.user_id,
    filename: cat.filename ?? cat.originalImage,
    birthdate: cat.birthdate,
  };
  const fields = catFields.filter((field) => data[field] !== undefined);
  const values = fields.map((field) => data[field]);

  if (fields.length === 0) {
    return false;
  }

  const placeholders = fields.map(() => '?').join(', ');
  const [result] = await promisePool.execute(
    `INSERT INTO wsk_cats (${fields.join(', ')}) VALUES (${placeholders})`,
    values,
  );
  return { cat_id: result.insertId };
}

export async function modifyCat(cat, id) {
  const data = {
    cat_name: cat.cat_name ?? cat.name,
    weight: cat.weight,
    owner: cat.owner ?? cat.user_id,
    filename: cat.filename,
    birthdate: cat.birthdate,
  };
  const fields = catFields.filter((field) => data[field] !== undefined);
  if (fields.length === 0) {
    return false;
  }

  const values = fields.map((field) => data[field]);
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  const [result] = await promisePool.execute(
    `UPDATE wsk_cats SET ${assignments} WHERE cat_id = ?`,
    [...values, id],
  );
  return result.affectedRows > 0;
}

export async function removeCat(id) {
  const [result] = await promisePool.execute('DELETE FROM wsk_cats WHERE cat_id = ?', [id]);
  return result.affectedRows > 0;
}
