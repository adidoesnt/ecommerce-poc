import { tokenRepository } from 'repositories';
import { ObjectId } from 'mongodb';
import type { TokenCreateAttributes } from 'models/token';
import { tokenService } from 'services';
import { Logger } from 'utils';
import type {
    CustomRequest,
    RequestSession,
    SetupSessionParameters,
} from './types';

const { JWT_EXPIRY = 3600, RT_EXPIRY = 604800 } = process.env;
const rtExpiryInMS = Number(RT_EXPIRY) * 1000;

const logger = new Logger({
    module: 'services/token',
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

export const createTokenSetDocuments = async ({
    userId,
    jwt,
    rt,
}: SetupSessionParameters) => {
    const jwtDocument = await createToken({
        userId,
        token: jwt,
    });
    const rtDocument = await createToken({
        userId,
        token: rt,
    });
    return {
        jwtDocument,
        rtDocument,
    };
};

export const setupSession = async (
    request: CustomRequest,
    { userId, jwt, rt }: SetupSessionParameters,
) => {
    try {
        logger.info('Creating session with attributes:', {
            userId,
            jwt,
            rt,
        });
        const { jwtDocument, rtDocument } = await tokenService.createTokenSetDocuments({
            userId,
            jwt,
            rt,
        });
        request.session.jwt = jwt;
        request.session.rt = rt;
        logger.info('Setting up token deletion upon expiry:', {
            jwt: {
                id: jwtDocument._id.toString(),
                expiry: JWT_EXPIRY,
            },
            rt: {
                id: rtDocument._id.toString(),
                expiry: RT_EXPIRY,
            },
        });
        setTimeout(teardownSession.bind(null, request), rtExpiryInMS);
    } catch (error) {
        logger.error('Error setting up session:', error as Error);
        throw error;
    }
};

export const deleteTokenSetDocuments = async (jwt: string, rt: string) => {
    await tokenRepository.deleteOne({ token: jwt });
    await tokenRepository.deleteOne({ token: rt });
};

export const teardownSession = async (request: CustomRequest) => {
    try {
        logger.info('Tearing down session');
        const { jwt, rt } = request.session;
        deleteTokenSetDocuments(jwt, rt);
        request.session.destroy((err) => {
            if (err) {
                logger.error('Error destroying session:', err);
                return;
            }
            logger.info('Session destroyed');
        });
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

export const expireSessionTokens = async (jwt: string, rt: string) => {
    await Promise.all([
        await tokenRepository.updateOne(
            { token: rt },
            {
                isExpired: true,
            },
        ),
        await tokenRepository.updateOne(
            { token: jwt },
            {
                isExpired: true,
            },
        ),
    ]);
};

export const expireSession = async (session: RequestSession) => {
    try {
        const { jwt, rt, cookie } = session;
        logger.info('Expiring session', {
            jwt,
            rt,
            cookie,
        });
        await expireSessionTokens(jwt, rt);
    } catch (error) {
        logger.error('Error expiring session:', error as Error);
        throw error;
    }
};
