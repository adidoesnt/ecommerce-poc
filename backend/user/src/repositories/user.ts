import { User, UserModel } from 'models';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'repositories/user',
});

export const createOne = async (user: User) => {
    try {
        return await UserModel.create(user);
    } catch (error) {
        logger.error('Error creating user:', error as Error);
        throw error;
    }
};
