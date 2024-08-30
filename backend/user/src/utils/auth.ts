import type { Request } from 'express';
import { Logger } from './logger';
import { cookieConfig } from 'controllers/constants';

const logger = new Logger({
    module: 'utils/auth',
});

export const getTokenFromRequest = (request: Request) => {
    try {
        const { authorization } = request.headers;
        if (!authorization) throw new Error('No authorization header');
        const [prefix, token] = authorization.split(' ');
        if (prefix !== 'Bearer')
            throw new Error('Invalid authorization header');
        return token;
    } catch (error) {
        logger.error('Error getting token from request:', error as Error);
        throw error;
    }
};

export const getRefreshTokenFromRequest = (request: Request): string => {
    try {
        const { [cookieConfig.rt.name]: refreshToken } = request.cookies || {};
        if (!refreshToken) throw new Error('No refresh token cookie');
        return refreshToken;
    } catch (error) {
        logger.error(
            'Error getting refresh token from request:',
            error as Error,
        );
        throw error;
    }
};
