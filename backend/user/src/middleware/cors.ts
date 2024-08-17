import cors from 'cors';
import type { Express } from 'express';
import { Logger } from 'utils';

const { NODE_ENV = 'DEV' } = process.env;

const logger = new Logger({
    module: 'middleware/cors',
});

export const setupCors = (app: Express) => {
    const corsOptions =
        NODE_ENV !== 'DEV'
            ? {
                  origin: [],
                  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
              }
            : undefined;
    logger.info('Setting up CORS middleware with options:', {
        options: corsOptions,
    });
    const middleware = cors(corsOptions);
    app.use(middleware);
};
