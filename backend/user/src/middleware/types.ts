import type { Request } from 'express';

export type ErrorWithStatus = Error & { status: number };

export type RequestWithUser = Request & {
    user: Express.User;
};
