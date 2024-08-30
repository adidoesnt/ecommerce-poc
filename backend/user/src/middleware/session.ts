import session, { Cookie } from 'express-session';
import type { Express } from 'express';
import { Logger } from 'utils';
import config from 'config.json';
import MongoStore from 'connect-mongo';

const {
    NODE_ENV = 'DEV',
    SESSION_SECRET = 'dummy-secret',
    MONGODB_URI = 'dummy-uri',
    SESSION_COLLECTION_NAME = 'sessions',
    RT_EXPIRY = 604800,
} = process.env;
const rtExpiryInMS = Number(RT_EXPIRY) * 1000;

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
        ...config.session,
        secret: SESSION_SECRET,
        store: sessionStore,
        secure,
        cookie: {
            maxAge: rtExpiryInMS,
        },
    };
    app.use(session(sessionOptions));
};
