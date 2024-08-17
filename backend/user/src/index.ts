import { contextPath } from 'config.json';
import express from 'express';
import { healthRouter, userRouter } from 'routes';
import {
    errorHandler,
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

app.use(healthRouter);
app.use(contextPath.user, userRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
    await database.connect();
    logger.info(`🚀 User service listening on port ${PORT}`);
});
