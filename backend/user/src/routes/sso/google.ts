import { Router } from 'express';
import { userController } from 'controllers';
import { contextPath } from 'config.json';
import { Logger } from 'utils';

const { auth, callback } = contextPath.google;

const logger = new Logger({
    module: 'routes/sso/google',
});

const router = Router();

router.get(auth, (request, response, next) => {
    logger.info(`GET ${auth}`);
    return userController.googleLogin({ request, response, next });
});

router.get(callback, (request, response, next) => {
    logger.info(`GET ${callback}`);
    return userController.googleLoginCallback({ request, response, next });
});

export default router;
