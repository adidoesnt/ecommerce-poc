import express from 'express';
import { healthRouter } from 'routes';
import { setupBodyParser, setupCors, setupHelmet } from 'middleware';
import { database, Logger } from 'utils';

const { PORT = 3001 } = process.env;

const logger = new Logger({
    module: 'index',
});

const app = express();

setupCors(app);
setupBodyParser(app);
setupHelmet(app);

app.use(healthRouter);

app.listen(PORT, async () => {
    await database.connect();
    logger.info(`🚀 User service listening on port ${PORT}`);
});
