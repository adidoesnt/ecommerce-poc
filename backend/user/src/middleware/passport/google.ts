import { logger } from '@typegoose/typegoose/lib/logSettings';
import { LoginType } from 'models/user';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userService } from 'services';
import { contextPath } from 'config.json';
import { ErrorMessage } from './passport';

const {
    BASE_URL = 'http://localhost:3001',
    GOOGLE_CLIENT_ID = 'dummy-client-id',
    GOOGLE_CLIENT_SECRET = 'dummy-client-secret',
} = process.env;
const { callback: googleCallbackPath } = contextPath.google;

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
