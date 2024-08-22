import { Token, TokenModel } from 'models';
import type { TokenCreateAttributes } from 'models/token';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'repositories/token',
});

export const createOne = async (token: TokenCreateAttributes) => {
    try {
        return await TokenModel.create(token);
    } catch (error) {
        logger.error('Error creating token:', error as Error);
        throw error;
    }
};

export const deleteOne = async (token: Partial<Token>) => {
    try {
        return await TokenModel.deleteOne(token);
    } catch (error) {
        logger.error('Error deleting token:', error as Error);
        throw error;
    }
};

export const updateOne = async (
    query: Partial<Token>,
    updates: Partial<Token>,
) => {
    try {
        return await TokenModel.updateOne(query, updates);
    } catch (error) {
        logger.error('Error updating token:', error as Error);
        throw error;
    }
};
