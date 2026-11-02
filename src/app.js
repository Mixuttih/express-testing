import express from 'express';
import catRoutes from './api/routes/cat-routes.js';
import userRoutes from './api/routes/user-routes.js';

const app = express();

app.use(express.json());
app.use('/images', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.use('/api/v1/cats', catRoutes);
app.use('/api/v1/users', userRoutes);

export default app;
