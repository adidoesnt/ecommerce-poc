import passport from 'passport';
import { Logger } from 'utils';
import { userService } from 'services';
import type { Express, Request, Response, NextFunction } from 'express';
import type { User } from 'models';
import { RES } from 'controllers/types';
import { setupGoogleAuthStrategy } from './google';
import { setupLocalAuthStrategy } from 'middleware';

const logger = new Logger({
    module: 'middleware/passport',
});

export enum ErrorMessage {
    USER_NOT_FOUND = 'User not found',
    INCORRECT_PASSWORD = 'Incorrect password',
    INSUFFICIENT_PROFILE = 'Insufficient profile information',
}

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.isAuthenticated()) {
        return next();
    }
    const { status, message } = RES.UNAUTHORIZED;
    return res.status(status).json({ message });
};

export const setupPassport = (app: Express) => {
    logger.info('Setting up passport middleware');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: Express.User, done) => {
        done(null, (user as User)._id);
    });

    passport.deserializeUser(async (id: string, done) => {
        const user = await userService.findUserById(id);
        done(null, user);
    });

    setupLocalAuthStrategy();
    setupGoogleAuthStrategy();
};
