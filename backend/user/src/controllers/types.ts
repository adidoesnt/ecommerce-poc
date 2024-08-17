import type { Request, Response, NextFunction } from 'express';

export type ControllerProps = {
    request: Request;
    response: Response;
    next: NextFunction;
};

export const RES = {
    OK: {
        status: 200,
        message: 'OK',
    },
}
