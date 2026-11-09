import express from 'express';
import catRoutes from './api/routes/cat-routes.js';
import userRoutes from './api/routes/user-routes.js';
import authRoutes from './api/routes/auth-routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

app.use('/api/v1/cats', catRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
export default app;
