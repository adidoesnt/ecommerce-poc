import express from 'express';
import { healthRouter } from 'routes';
import { setupBodyParser, setupCors, setupHelmet } from 'middleware';

const { PORT = 3001 } = process.env;

const app = express();

setupCors(app);
setupBodyParser(app);
setupHelmet(app);

app.use(healthRouter);

app.listen(PORT, () => {
    console.log(`🚀 User service listening on port ${PORT}`);
});
