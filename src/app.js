import express from 'express';
const app = express();

app.use(express.json());
app.use('/images', express.static('public'));

const cats = [
  {
    cat_id: 1,
    name: 'Whiskers',
    birthdate: '2020-01-15',
    weight: 4.5,
    owner: 'Alice',
    image: '/images/100.jpg',
  },
  {
    cat_id: 2,
    name: 'Fluffy',
    birthdate: '2019-06-20',
    weight: 5.0,
    owner: 'Bob',
    image: '/images/200.jpg',
  },
  {
    cat_id: 3,
    name: 'Mittens',
    birthdate: '2021-03-10',
    weight: 3.5,
    owner: 'Charlie',
    image: '/images/300.jpg',
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/v1/cats', (req, res) => {
  res.json(cats);
});

app.post('/api/v1/cats', (req, res) => {
  const newCat = {
    cat_id: Math.max(...cats.map((cat) => cat.cat_id)) + 1,
    ...req.body
  };

  cats.push(newCat);
  res.status(201).json(newCat);
});

app.get('/api/v1/cats/:id', (req, res) => {
  const catId = Number(req.params.id);
  const foundCat = cats.find((cat) => cat.cat_id === catId);

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
});

app.put('/api/v1/cats/:id', (req, res) => {
  res.json({ message: 'Cat item updated.' });
});

app.delete('/api/v1/cats/:id', (req, res) => {
  res.json({ message: 'Cat item deleted.' });
});

export default app;
