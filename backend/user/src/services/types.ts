import type { Request } from 'express';

export enum ErrorCode {
    DUPLICATE_KEY = 11000,
}

export type RequestSession = Request['session'] & {
    token: string;
};

export type CustomRequest = Omit<Request, 'session'> & {
    session: RequestSession;
};
