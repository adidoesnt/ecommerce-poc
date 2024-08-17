import { healthController } from 'controllers';
import {
    Router,
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import { Logger } from 'utils';

const router = Router();

const logger = new Logger({
    module: 'routes/health',
});

router.get(
    /^\/(health)?$/,
    (request: Request, response: Response, next: NextFunction) => {
        logger.info('GET /health');
        return healthController.getHealth({ request, response, next });
    },
);

export default router;
