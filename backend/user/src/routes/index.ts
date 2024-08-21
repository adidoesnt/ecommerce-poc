import type { Express } from 'express';
import { default as healthRouter } from 'routes/health';
import { default as googleAuthRouter } from 'routes/sso/google';
import { default as loginRouter } from 'routes/login';
import { default as logoutRouter } from 'routes/logout';
import { default as signupRouter } from 'routes/signup';

export const setupRoutes = (app: Express) => {
    app.use(healthRouter);
    app.use(googleAuthRouter);
    app.use(loginRouter);
    app.use(logoutRouter);
    app.use(signupRouter);
};
