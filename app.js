import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/v1/cats', (req, res) => {
  const cats = [
    { cat_id: 1, name: 'Whiskers', birthdate: '2020-01-15', weight: 4.5, owner: 'Alice', image: 'https://placecats.com/300/200' },
    { cat_id: 2, name: 'Fluffy', birthdate: '2019-06-20', weight: 5.0, owner: 'Bob', image: 'https://placecats.com/300/200' },
    { cat_id: 3, name: 'Mittens', birthdate: '2021-03-10', weight: 3.5, owner: 'Charlie', image: 'https://placecats.com/300/200' },
  ];
  res.json(cats);
});
