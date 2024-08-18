import type { Request, Response, NextFunction } from 'express';

export type ControllerProps = {
    request: Request;
    response: Response;
    next: NextFunction;
};

export class ControllerError extends Error {
    status: number;

    constructor(message: string, options: { status: number }) {
        super(message);
        this.status = options.status;
    }
}

export const RES = {
    OK: {
        status: 200,
        message: 'OK',
    },
    CREATED: {
        status: 201,
        message: 'Created',
    },
    BAD_REQUEST: {
        status: 400,
        message: 'Bad request',
    },
    UNAUTHORIZED: {
        status: 401,
        message: 'Unauthorized',
    },
    FORBIDDEN: {
        status: 403,
        message: 'Forbidden',
    },
    CONFLICT: {
        status: 409,
        message: 'Conflict',
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: 'Internal server error',
    },
};
