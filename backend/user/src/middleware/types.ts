import type { Request } from 'express';

export type RequestWithUser = Request & {
    user: Express.User;
};
