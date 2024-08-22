import session from 'express-session';
import type { Express } from 'express';
import { Logger } from 'utils';
import config from 'config.json';
import MongoStore from 'connect-mongo';

const {
    NODE_ENV = 'DEV',
    SESSION_SECRET = 'dummy-secret',
    MONGODB_URI = 'dummy-uri',
    SESSION_COLLECTION_NAME = 'passport',
} = process.env;

const logger = new Logger({
    module: 'middleware/session',
});

const sessionStore = new MongoStore({
    mongoUrl: MONGODB_URI,
    collectionName: SESSION_COLLECTION_NAME,
});

export const setupSession = (app: Express) => {
    logger.info('Setting up session middleware');
    const secure = NODE_ENV !== 'DEV';
    const sessionOptions = {
        secret: SESSION_SECRET,
        ...config.session,
        store: sessionStore,
        secure,
    };
    app.use(session(sessionOptions));
};
