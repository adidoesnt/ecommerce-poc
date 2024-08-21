import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Logger } from 'utils';
import { userService } from 'services';
import type { Express, Request, Response, NextFunction } from 'express';
import type { User } from 'models';
import { RES } from 'controllers/types';
import { contextPath } from 'config.json';
import { LoginType } from 'models/user';

const {
    BASE_URL = 'http://localhost:3001',
    GOOGLE_CLIENT_ID = 'dummy-client-id',
    GOOGLE_CLIENT_SECRET = 'dummy-client-secret',
} = process.env;
const { callback: googleCallbackPath } = contextPath.google;

const logger = new Logger({
    module: 'middleware/passport',
});

enum ErrorMessage {
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

export const setupLocalAuthStrategy = () => {
    logger.info('Setting up local auth strategy');
    passport.use(
        'local',
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            async (email, password, done) => {
                try {
                    const user = await userService.findUserByEmail(email);
                    if (!user) {
                        return done(null, false, {
                            message: ErrorMessage.USER_NOT_FOUND,
                        });
                    }
                    const isPasswordValid = await userService.checkPassword(
                        password,
                        user,
                    );
                    if (!isPasswordValid) {
                        return done(null, false, {
                            message: ErrorMessage.INCORRECT_PASSWORD,
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    logger.error('Error authenticating user:', error as Error);
                    return done(error);
                }
            },
        ),
    );
};

export const setupGoogleAuthStrategy = () => {
    logger.info('Setting up Google auth strategy');
    passport.use(
        'google',
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: `${BASE_URL}${googleCallbackPath}`,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const { emails, name } = profile;
                    const email = emails?.[0].value;
                    const firstName = name?.givenName;
                    const lastName = name?.familyName;
                    if (!email || !firstName || !lastName)
                        throw new Error(ErrorMessage.INSUFFICIENT_PROFILE);
                    let user = await userService.findUserByEmail(email);
                    if (user === null) {
                        user = await userService.addUser({
                            email,
                            firstName,
                            lastName,
                            loginType: LoginType.GOOGLE,
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    logger.error('Error authenticating user:', error as Error);
                    return done(error);
                }
            },
        ),
    );
};
