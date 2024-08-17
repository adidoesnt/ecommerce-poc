import { urlencoded, json } from 'body-parser';
import type { Express } from 'express';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'middleware/bodyParser',
});

export const setupBodyParser = (app: Express) => {
    logger.info('Setting up body parser middleware');
    app.use(urlencoded({ extended: true }));
    app.use(json());
};
