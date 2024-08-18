import { contextPath } from 'config.json';
import { userController } from 'controllers';
import { Router } from 'express';
import { isAuthenticated } from 'middleware/passport';
import { Logger } from 'utils';

const { login: loginContextPath, logout: logoutContextPath } = contextPath.user;

const logger = new Logger({
    module: 'routes/user',
});

const router = Router();

router.post('/', async (request, response, next) => {
    logger.info('POST /user');
    return await userController.signup({ request, response, next });
});

router.post(loginContextPath, userController.login);

router.post(`${loginContextPath}/success`, (request, response, next) => {
    logger.info(`POST ${loginContextPath}/success`);
    return userController.loginSuccess({ request, response, next });
});

router.post(`${loginContextPath}/failure`, (request, response, next) => {
    logger.info(`POST ${loginContextPath}/failure`);
    return userController.loginFailure({ request, response, next });
});

router.post(logoutContextPath, isAuthenticated, (request, response, next) => {
    logger.info(`POST ${logoutContextPath}`);
    return userController.logout({ request, response, next });
});

router.post(`${logoutContextPath}/success`, (request, response, next) => {
    logger.info(`POST ${logoutContextPath}/success`);
    return userController.logoutSuccess({ request, response, next });
});

export default router;
