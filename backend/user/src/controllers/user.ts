import { contextPath } from 'config.json';
import { userService } from 'services';
import { RES, type ControllerProps } from './types';
import { Logger } from 'utils';
import passport from 'passport';

const { login: loginContextPath, logout: logoutContextPath } = contextPath.user;

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

export const login = passport.authenticate('local', {
    successRedirect: `.${loginContextPath}/success`,
    failureRedirect: `.${loginContextPath}/failure`,
    failureFlash: true,
});

export const loginSuccess = async ({ response }: ControllerProps) => {
    logger.info('Calling loginSuccess controller');
    const { status, message } = RES.OK;
    return response.status(status).json({ message });
};

export const loginFailure = async ({ response }: ControllerProps) => {
    logger.info('Calling loginFailure controller');
    const { status, message } = RES.FORBIDDEN;
    return response.status(status).json({ message });
};

export const logout = async ({ request, response }: ControllerProps) => {
    logger.info('Calling logout controller');
    if (!request.logout) {
        const { status, message } = RES.INTERNAL_SERVER_ERROR;
        return response.status(status).json({ message });
    }
    request.logout((err) => {
        if (err) {
            const { status, message } = RES.INTERNAL_SERVER_ERROR;
            logger.error('Error logging out:', err);
            return response.status(status).json({ message });
        }
        return response.redirect(`.${logoutContextPath}/success`);
    });
};

export const logoutSuccess = async ({ response }: ControllerProps) => {
    logger.info('Calling logoutSuccess controller');
    const { status, message } = RES.OK;
    return response.status(status).json({ message });
};
