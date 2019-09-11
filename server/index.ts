import { config } from 'dotenv';
config();

import next from 'next';
import express from 'express';

import apiRoutes from './api';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
server.use(express.json());
server.listen(port);

app.prepare().then(() => {
  server.use('/api', apiRoutes);
  server.get('*', (req, res) => handle(req, res));

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
