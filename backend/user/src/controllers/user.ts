import { userService } from 'services';
import { RES, type ControllerProps } from './types';

export const addUser = async ({ request, response, next }: ControllerProps) => {
    try {
        const { body } = request;
        const user = await userService.addUser(body);
        const { status, message } = RES.CREATED;
        return response.status(status).json({ message, user });
    } catch (error) {
        next(error);
    }
};
