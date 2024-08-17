import { userController } from 'controllers';
import { Router } from 'express';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'routes/user',
});

const router = Router();

router.post('/', async (request, response, next) => {
    logger.info('POST /user');
    return await userController.signup({ request, response, next });
});

export default router;
