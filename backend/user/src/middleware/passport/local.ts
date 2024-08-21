import { logger } from '@typegoose/typegoose/lib/logSettings';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userService } from 'services';
import { ErrorMessage } from './passport';

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
