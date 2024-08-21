import { Router } from 'express';
import { userController } from 'controllers';
import { contextPath } from 'config.json';
import { Logger } from 'utils';

const { signup: signupPath } = contextPath.user;

const logger = new Logger({
    module: 'routes/logout',
});

const router = Router();

router.post(signupPath, async (request, response, next) => {
    logger.info('POST /user');
    return await userController.signup({ request, response, next });
});

export default router;
