import cors from 'cors';
import type { Express } from 'express';

const { NODE_ENV = 'DEV' } = process.env;

export const setupCors = (app: Express) => {
    const corsOptions =
        NODE_ENV !== 'DEV'
            ? {
                  origin: [],
                  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
              }
            : undefined;
    const middleware = cors(corsOptions);
    app.use(middleware);
};
