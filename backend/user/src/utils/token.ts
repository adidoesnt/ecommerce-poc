import jwt from 'jsonwebtoken';
import type { User } from 'models';
import { Logger } from 'utils';

const { JWT_SECRET = 'dummy-secret', JWT_EXPIRY = 3600 } = process.env;

const logger = new Logger({
    module: 'utils/token',
});

export const generateToken = async (user: User) => {
    try {
        logger.info('Generating token with user:', user);
        const { _id, email, firstName, lastName } = user;
        const payload = {
            _id,
            email,
            firstName,
            lastName,
        };
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        });
        return token;
    } catch (error) {
        logger.error('Error generating token:', error as Error);
        throw error;
    }
};
