import { tokenRepository } from 'repositories';
import { ObjectId } from 'mongodb';
import type { TokenCreateAttributes } from 'models/token';
import { tokenService } from 'services';
import { Logger } from 'utils';
import type { CustomRequest } from './types';

const { JWT_EXPIRY = 3600 } = process.env;
const jwtExpiryInMS = Number(JWT_EXPIRY) * 1000;

const logger = new Logger({
    module: 'services/session',
});

export const createToken = async (token: TokenCreateAttributes) => {
    try {
        logger.info('Creating token with attributes:', token);
        return await tokenRepository.createOne(token);
    } catch (error) {
        logger.error('Error creating token:', error as Error);
        throw error;
    }
};

export const setupSession = async (
    request: CustomRequest,
    { userId, token }: TokenCreateAttributes,
) => {
    try {
        logger.info('Creating session with attributes:', {
            userId,
            token,
        });
        const session = await tokenService.createToken({
            userId,
            token,
        });
        request.session.token = session.token;
        logger.info('Setting up session deletion expiry:', {
            sessionId: session._id.toString(),
            jwtExpiryInMS,
        });
        setTimeout(teardownSession.bind(null, request), jwtExpiryInMS);
    } catch (error) {
        logger.error('Error setting up session:', error as Error);
        throw error;
    }
};

export const teardownSession = async (request: CustomRequest) => {
    try {
        logger.info('Tearing down session');
        request.session.destroy((err) => {
            if (err) {
                logger.error('Error destroying session:', err);
                return;
            }
            logger.info('Session destroyed');
        });
        // TODO: clear sid cookie
    } catch (error) {
        logger.error('Error tearing down session:', error as Error);
        throw error;
    }
};

export const deleteSessionById = async (id: string | ObjectId) => {
    try {
        let _id: ObjectId = typeof id === 'string' ? new ObjectId(id) : id;
        return await tokenRepository.deleteOne({
            _id,
        });
    } catch (error) {
        logger.error('Error deleting session:', error as Error);
        throw error;
    }
};

export const expireSessionByToken = async (token: string) => {
    try {
        logger.info('Expiring session with token:', { token });
        return await tokenRepository.updateOne(
            { token },
            {
                expired: true,
            },
        );
    } catch (error) {
        logger.error('Error expiring session:', error as Error);
        throw error;
    }
};
