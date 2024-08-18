import { sessionRepository } from 'repositories';
import { ObjectId } from 'mongodb';
import type { SessionCreateAttributes } from 'models/session';
import { sessionService } from 'services';
import { Logger } from 'utils';

const { JWT_EXPIRY = 3600 } = process.env;
const jwtExpiryInMS = Number(JWT_EXPIRY) * 1000;

const logger = new Logger({
    module: 'services/session',
});

export const createSession = async (session: SessionCreateAttributes) => {
    try {
        logger.info('Creating session with atrributes:', session);
        return await sessionRepository.createOne(session);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const setupSession = async ({
    userId,
    token,
}: SessionCreateAttributes) => {
    try {
        logger.info('Creating session with attributes:', {
            userId,
            token,
        });
        const session = await sessionService.createSession({
            userId,
            token,
        });
        logger.info('Setting up session deletion expiry:', {
            sessionId: session._id.toString(),
            jwtExpiryInMS,
        });
        setTimeout(() => {
            sessionService.deleteSessionById(session._id);
        }, jwtExpiryInMS);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteSessionById = async (id: string | ObjectId) => {
    try {
        let _id: ObjectId = typeof id === 'string' ? new ObjectId(id) : id;
        return await sessionRepository.deleteOne({
            _id,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const expireSessionById = async (id: string | ObjectId) => {
    try {
        let _id: ObjectId = typeof id === 'string' ? new ObjectId(id) : id;
        return await sessionRepository.updateOne({
            _id,
            expired: true,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};
