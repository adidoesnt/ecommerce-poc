import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Logger } from 'utils';
import { userService } from 'services';
import type { Express } from 'express';
import type { User } from 'models';

const logger = new Logger({
    module: 'middleware/passport',
});

enum ErrorMessage {
    USER_NOT_FOUND = 'User not found',
    INCORRECT_PASSWORD = 'Incorrect password',
}

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
};

export const setupLocalAuthStrategy = () => {
    logger.info('Setting up passport middleware');
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
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
