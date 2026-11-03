import { createCat, findCatById, getAllCats } from '../models/cat-model.js';

export function getCats(req, res) {
  res.json({
    message: 'Cats retrieved.',
    time: req.requestTime,
    data: getAllCats()
  });
}

export function addCat(req, res) {
  const newCat = createCat(req.body);
  res.status(201).json(newCat);
}

export function getCatById(req, res) {
  const catId = Number(req.params.id);
  const foundCat = findCatById(catId);

  if (!foundCat) {
    return res.sendStatus(404);
  }

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${foundCat.name}</title>
      </head>
      <body>
        <main>
          <h1>${foundCat.name}</h1>
          <img src="${foundCat.image}" alt="${foundCat.name}">
          <p>Birthdate: ${foundCat.birthdate}</p>
          <p>Weight: ${foundCat.weight} kg</p>
          <p>Owner: ${foundCat.owner}</p>
        </main>
      </body>
    </html>
  `);
}

export function updateCat(req, res) {
  res.json({ message: 'Cat item updated.' });
}

export function deleteCat(req, res) {
  res.json({ message: 'Cat item deleted.' });
}
