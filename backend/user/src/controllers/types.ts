import type { Request, Response, NextFunction } from 'express';

export type ControllerProps = {
    request: Request;
    response: Response;
    next: NextFunction;
};

export type CustomError = Error & { status: number };

export const RES = {
    OK: {
        status: 200,
        message: 'OK',
    },
    CREATED: {
        status: 201,
        message: 'Created',
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: 'Internal server error',
    },
};
