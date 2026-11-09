import express from 'express';
import cors from 'cors';
import catRoutes from './api/routes/cat-routes.js';
import userRoutes from './api/routes/user-routes.js';
import authRoutes from './api/routes/auth-routes.js';
import { notFoundHandler, errorHandler } from './api/middlewares/error-handlers.js';

const app = express();

app.use(cors())
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

 // Default for all routes not handled by routers above
 app.use(notFoundHandler);
 // Add error handler middleware as the last middleware in the chain
 app.use(errorHandler);

export default app;
