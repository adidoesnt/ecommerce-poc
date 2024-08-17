import session from 'express-session';
import type { Express } from 'express';
import { Logger } from 'utils';
import config from 'config.json';

const { SESSION_SECRET = 'dummy-secret' } = process.env;

const logger = new Logger({
    module: 'middleware/session',
});

export const setupSession = (app: Express) => {
    logger.info('Setting up session middleware');
    const sessionOptions = {
        secret: SESSION_SECRET,
        ...config.session,
    };
    app.use(session(sessionOptions));
};
