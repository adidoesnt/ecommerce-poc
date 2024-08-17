import { RES, type CustomError } from 'controllers/types';
import type { Request, Response } from 'express';

export const errorHandler = (
    error: Error,
    _request: Request,
    response: Response,
) => {
    const { status = 500 } = error as CustomError;
    response
        .status(status)
        .json({ message: error.message ?? RES.INTERNAL_SERVER_ERROR.message });
};
