import type { Request, Response, NextFunction, Router } from 'express';
import { getTokenFromRequest, getRefreshTokenFromRequest } from 'utils/auth';
import { verify } from 'jsonwebtoken';
import type { ErrorWithStatus } from './types';
import { RES } from 'controllers/types';

const { JWT_SECRET = 'dummy-secret', RT_SECRET = 'dummy-secret' } = process.env;

const authorise = (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = getTokenFromRequest(req);
        const refreshToken = getRefreshTokenFromRequest(req);
        let error: ErrorWithStatus | null = null;
        if (!jwt) {
            error = new Error('No JWT token') as ErrorWithStatus;
            error.status = RES.UNAUTHORIZED.status;
        } else if (!refreshToken) {
            error = new Error('No refresh token') as ErrorWithStatus;
            error.status = RES.UNAUTHORIZED.status;
        }
        const validJWT = verify(jwt, JWT_SECRET);
        const validRT = verify(refreshToken, RT_SECRET);
        if (!validJWT) {
            error = new Error('Invalid JWT token') as ErrorWithStatus;
            error.status = RES.FORBIDDEN.status;
            // TODO: try to refresh token
        } else if (!validRT) {
            error = new Error('Invalid refresh token') as ErrorWithStatus;
            error.status = RES.FORBIDDEN.status;
        }
        if (error) {
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export const setupAuthorisation = (router: Router) => {
    router.use(authorise);
};
