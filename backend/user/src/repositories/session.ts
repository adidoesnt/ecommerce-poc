import { Session, SessionModel } from 'models';
import type { SessionCreateAttributes } from 'models/session';
import { Logger } from 'utils';

const logger = new Logger({
    module: 'repositories/session',
});

export const createOne = async (session: SessionCreateAttributes) => {
    try {
        return await SessionModel.create(session);
    } catch (error) {
        logger.error('Error creating session:', error as Error);
        throw error;
    }
};

export const deleteOne = async (session: Partial<Session>) => {
    try {
        return await SessionModel.deleteOne(session);
    } catch (error) {
        logger.error('Error deleting session:', error as Error);
        throw error;
    }
};

export const updateOne = async (
    query: Partial<Session>,
    updates: Partial<Session>,
) => {
    try {
        return await SessionModel.updateOne(query, updates);
    } catch (error) {
        logger.error('Error updating session:', error as Error);
        throw error;
    }
};
