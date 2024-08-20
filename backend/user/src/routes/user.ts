import { contextPath } from 'config.json';
import { userController } from 'controllers';
import type { ControllerProps } from 'controllers/types';
import { Router } from 'express';
import { isAuthenticated } from 'middleware/passport';
import { Logger } from 'utils';

const { login: loginContextPath, logout: logoutContextPath } = contextPath.user;
const { root: googleRootPath } = contextPath.google;

const logger = new Logger({
    module: 'routes/user',
});

const router = Router();

router.post('/', async (request, response, next) => {
    logger.info('POST /user');
    return await userController.signup({ request, response, next });
});

router.post(loginContextPath, userController.login);

const handleLoginSuccess = (
    request: ControllerProps['request'],
    response: ControllerProps['response'],
    next: ControllerProps['next'],
) => {
    logger.info(`POST ${loginContextPath}/success`);
    return userController.loginSuccess({ request, response, next });
};

const handleLoginFailure = (
    request: ControllerProps['request'],
    response: ControllerProps['response'],
    next: ControllerProps['next'],
) => {
    logger.info(`POST ${loginContextPath}/failure`);
    return userController.loginFailure({ request, response, next });
};

router
    .route(`${loginContextPath}/success`)
    .get(handleLoginSuccess)
    .post(handleLoginSuccess);

router
    .route(`${loginContextPath}/failure`)
    .get(handleLoginFailure)
    .post(handleLoginFailure);

router.post(logoutContextPath, isAuthenticated, (request, response, next) => {
    logger.info(`POST ${logoutContextPath}`);
    return userController.logout({ request, response, next });
});

router.post(`${logoutContextPath}/success`, (request, response, next) => {
    logger.info(`POST ${logoutContextPath}/success`);
    return userController.logoutSuccess({ request, response, next });
});

// Google Login
router.get(googleRootPath, (request, response, next) => {
    logger.info(`GET ${googleRootPath}`);
    return userController.googleLogin({ request, response, next });
});

export default router;
