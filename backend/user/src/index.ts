import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { healthRouter } from 'routes';

const { PORT = 3001 } = process.env;

const app = express();
app.use(healthRouter);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`🚀 User service listening on port ${PORT}`);
});
