import { config } from 'dotenv';
config();

import express from 'express';
import mongoose from 'mongoose';
import next from 'next';
import path from 'path';

import apiRoutes from './api';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
server.use(express.json());
server.listen(port);

app
  .prepare()
  .then(() => {
    const DATABASE_URL = process.env.DATABASE_URL || 'DB URL MISSING';

    mongoose
      .connect(DATABASE_URL, { useFindAndModify: false, useNewUrlParser: true })
      .catch((e) => {
        console.log('> Unable to connect to mongodb.');
        console.error(e);
      });
  })
  .then(() => {
    const serviceWorkerPathname = '/service-worker.js';

    server.use(serviceWorkerPathname, (req, res) => {
      const filePath = path.resolve(
        path.join(__dirname, '../', serviceWorkerPathname)
      );

      app.serveStatic(req, res, filePath);
    });

    server.use('/ytw', apiRoutes);
    server.get('*', (req, res) => handle(req, res));

    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`
    );
  });
