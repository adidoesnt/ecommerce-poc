import { contextPath } from 'config.json';
import { userController } from 'controllers';
import { Router } from 'express';
import { isAuthenticated } from 'middleware/passport';
import { Logger } from 'utils';

const {
    logout: logoutPath,
} = contextPath.user;

const logger = new Logger({
    module: 'routes/user',
});

const router = Router();

router.post(logoutPath, isAuthenticated, (request, response, next) => {
    logger.info(`POST ${logoutPath}`);
    return userController.logout({ request, response, next });
});

router.post(`${logoutPath}/success`, (request, response, next) => {
    logger.info(`POST ${logoutPath}/success`);
    return userController.logoutSuccess({ request, response, next });
});

export default router;
