import { RES, type ControllerError } from 'controllers/types';
import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction,
) => {
    const { status = 500 } = error as ControllerError;
    return response
        .status(status)
        .json({ message: error.message ?? RES.INTERNAL_SERVER_ERROR.message });
};
