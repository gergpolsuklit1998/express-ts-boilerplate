import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(loggerMiddleware);
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
