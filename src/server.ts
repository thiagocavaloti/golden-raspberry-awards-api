import 'dotenv/config';
import express from 'express';

import movieRoutes from './routes/movies';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/movies', movieRoutes);


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server };