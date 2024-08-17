import { urlencoded, json } from 'body-parser';
import type { Express } from 'express';

export const setupBodyParser = (app: Express) => {
    app.use(urlencoded({ extended: true }));
    app.use(json());
};
