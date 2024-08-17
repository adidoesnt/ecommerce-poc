import { RES, type ControllerProps } from 'controllers/types';

export const getHealth = ({ response }: ControllerProps) => {
    const { status } = RES.OK;
    return response
        .status(status)
        .json({ message: 'User service is healthy.' });
};
