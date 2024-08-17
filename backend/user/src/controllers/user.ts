import { userService } from 'services';
import { RES, type ControllerProps } from './types';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'controllers/user',
});

export const addUser = async ({ request, response, next }: ControllerProps) => {
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
