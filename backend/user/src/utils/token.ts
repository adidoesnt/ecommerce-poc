import jwt from 'jsonwebtoken';
import type { User } from 'models';
import { Logger } from 'utils';

const {
    JWT_SECRET = 'dummy-secret',
    JWT_EXPIRY = 3600,
    RT_EXPIRY = 604800,
} = process.env;

const logger = new Logger({
    module: 'utils/token',
});

export type GenerateTokenOptions = {
    isRefreshToken?: boolean;
};

export const generateToken = async (
    user: User,
    options?: GenerateTokenOptions,
) => {
    try {
        logger.info('Generating token with user:', user);
        const { _id, email, firstName, lastName } = user;
        const payload = {
            _id,
            email,
            firstName,
            lastName,
            refresh: options?.isRefreshToken,
        };
        const expiresIn = options?.isRefreshToken ? RT_EXPIRY : JWT_EXPIRY;
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn,
        });
        return token;
    } catch (error) {
        logger.error('Error generating token:', error as Error);
        throw error;
    }
};

export const generateTokenSet = async (user: User) => {
    const jwt = await generateToken(user);
    const rt = await generateToken(user, {
        isRefreshToken: true,
    });
    return {
        jwt,
        rt,
    };
};
