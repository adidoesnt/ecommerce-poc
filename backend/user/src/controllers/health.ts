import { RES, type ControllerProps } from 'controllers/types';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'controllers/health',
});

export const getHealth = ({ response }: ControllerProps) => {
    logger.info('Calling getHealth controller');
    const { status } = RES.OK;
    return response
        .status(status)
        .json({ message: 'User service is healthy.' });
};
