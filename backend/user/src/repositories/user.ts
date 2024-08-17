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

export const findOne = async (
    options: Partial<User>,
) => {
    try {
        return await UserModel.findOne(options);
    } catch (error) {
        logger.error('Error finding user:', error as Error);
        throw error;
    }
};
