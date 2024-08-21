import { logger } from '@typegoose/typegoose/lib/logSettings';
import { contextPath } from 'config.json';
import { LoginType } from 'models/user';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { userService } from 'services';
import { ErrorMessage } from './passport';

const {
    BASE_URL = 'http://localhost:3001',
    FACEBOOK_APP_ID = 'dummy-client-id',
    FACEBOOK_APP_SECRET = 'dummy-client-secret',
} = process.env;
const { callback: facebookCallbackPath } = contextPath.facebook;

export const setupFacebookAuthStrategy = () => {
    passport.use(
        'facebook',
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: `${BASE_URL}${facebookCallbackPath}`,
                profileFields: ['id', 'emails', 'name']
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
                            loginType: LoginType.FACEBOOK,
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    logger.error('Error authenticating user:', error as Error);
                    return done(error);
                }
            },
        )
    )
};
