import { healthController } from 'controllers';
import {
    Router,
    type NextFunction,
    type Request,
    type Response,
} from 'express';

const router = Router();

router.get(
    /^\/(health)?$/,
    (request: Request, response: Response, next: NextFunction) => {
        return healthController.getHealth({ request, response, next });
    },
);

export default router;
