import { contextPath } from 'config.json';
import { tokenService, userService } from 'services';
import { RES, type ControllerProps } from './types';
import { authUtils, Logger, tokenUtils } from 'utils';
import passport from 'passport';
import type { RequestWithUser } from 'middleware/types';
import type { User } from 'models';
import type { CustomRequest, RequestSession } from 'services/types';
import { cookieConfig } from './constants';

const { BASE_URL = 'http://localhost:3001' } = process.env;
const { login: loginPath, logout: logoutPath } = contextPath.user;

const logger = new Logger({
    module: 'controllers/user',
});

export const signup = async ({ request, response, next }: ControllerProps) => {
    try {
        logger.info('Calling addUser controller');
        const { body } = request;
        const user = await userService.addUser(body);
        const { status, message } = RES.CREATED;
        return response.status(status).json({ message, user });
    } catch (error) {
        next(error);
    }
};

export const login = ({ request, response, next }: ControllerProps) => {
    logger.info('Calling login controller');
    const baseUrl = `${BASE_URL}${loginPath}`;
    return passport.authenticate('local', {
        successRedirect: `${baseUrl}/success`,
        failureRedirect: `${baseUrl}/failure`,
        failureFlash: true,
    })(request, response, next);
};

export const googleLogin = ({ request, response, next }: ControllerProps) => {
    logger.info('Calling googleLogin controller');
    return passport.authenticate('google', {
        scope: ['profile', 'email'],
    })(request, response, next);
};

export const googleLoginCallback = ({
    request,
    response,
    next,
}: ControllerProps) => {
    logger.info('Calling googleLoginCallback controller');
    const baseUrl = `${BASE_URL}${loginPath}`;
    return passport.authenticate('google', {
        successRedirect: `${baseUrl}/success`,
        failureRedirect: `${baseUrl}/failure`,
    })(request, response, next);
};

export const loginSuccess = async ({
    request,
    response,
    next,
}: ControllerProps) => {
    logger.info('Calling loginSuccess controller');
    try {
        const { status, message } = RES.OK;
        const { user } = request as RequestWithUser;
        const { jwt, rt } = await tokenUtils.generateTokenSet(user as User);
        await tokenService.setupSession(request as CustomRequest, {
            userId: (user as User)._id,
            jwt,
            rt,
        });
        return response
            .cookie(cookieConfig.rt.name, rt, cookieConfig.rt)
            .status(status)
            .json({ message, jwt });
    } catch (error) {
        next(error);
    }
};

export const loginFailure = async ({ response }: ControllerProps) => {
    logger.info('Calling loginFailure controller');
    const { status, message } = RES.FORBIDDEN;
    return response.status(status).json({ message });
};

export const logout = async ({ request, response }: ControllerProps) => {
    logger.info('Calling logout controller');
    const { status, message } = RES.INTERNAL_SERVER_ERROR;
    if (!request.logout) {
        return response.status(status).json({ message });
    }
    request.logout(async (err) => {
        if (err) {
            logger.error('Error logging out:', err);
            return response.status(status).json({ message });
        }
        try {
            const baseUrl = `${BASE_URL}${logoutPath}`;
            await tokenService.expireSession(request.session as RequestSession);
            return response.redirect(`${baseUrl}/success`);
        } catch (error) {
            logger.error('Error logging out:', error as Error);
            return response.status(status).json({ message });
        }
    });
};

export const logoutSuccess = async ({ response }: ControllerProps) => {
    logger.info('Calling logoutSuccess controller');
    const { status, message } = RES.OK;
    return response.status(status).json({ message });
};
