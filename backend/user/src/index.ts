import express from 'express';
import { setupRoutes } from 'routes';
import {
    setupErrorHandler,
    setupBodyParser,
    setupCors,
    setupHelmet,
    setupSession,
    setupPassport,
} from 'middleware';
import { database, Logger } from 'utils';

const { PORT = 3001 } = process.env;

const logger = new Logger({
    module: 'index',
});

const app = express();

setupCors(app);
setupBodyParser(app);
setupHelmet(app);
setupSession(app);
setupPassport(app);
setupRoutes(app);
setupErrorHandler(app);

app.listen(PORT, async () => {
    await database.connect();
    logger.info(`🚀 User service listening on port ${PORT}`);
});
