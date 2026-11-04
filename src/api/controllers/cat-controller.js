import {
  createCat,
  findCatById,
  getAllCats,
  getCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

export async function getCats(req, res) {
  res.json({
    message: 'Cats retrieved.',
    time: req.requestTime,
    data: await getAllCats(),
  });
}

export async function getCatsByUser(req, res) {
  res.json(await getCatsByUserId(Number(req.params.userId)));
}

export async function addCat(req, res) {
  const newCat = await createCat({
    ...req.body,
    ...(req.file && {
      filename: `/uploads/${req.file.filename}`,
    }),
  });

  if (!newCat) {
    return res.status(400).json({ message: 'Cat data is required.' });
  }
  res.redirect(303, `/api/v1/cats/${newCat.cat_id}`);
}

export async function getCatById(req, res) {
  const foundCat = await findCatById(Number(req.params.id));

  if (!foundCat) {
    return res.sendStatus(404);
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${foundCat.cat_name}</title>
      </head>
      <body>
        <main>
          <h1>${foundCat.cat_name}</h1>
          <img src="${foundCat.filename ?? ''}" alt="${foundCat.cat_name}">
          <p>Birthdate: ${foundCat.birthdate}</p>
          <p>Weight: ${foundCat.weight} kg</p>
          <p>Owner: ${foundCat.owner_name ?? 'Unknown'}</p>
        </main>
      </body>
    </html>
  `);
}

export async function updateCat(req, res) {
  if (!(await modifyCat(req.body, Number(req.params.id)))) {
    return res.sendStatus(404);
  }
  res.json({ message: 'Cat item updated.' });
}

export async function deleteCat(req, res) {
  if (!(await removeCat(Number(req.params.id)))) {
    return res.sendStatus(404);
  }
  res.json({ message: 'Cat item deleted.' });
}
