import type { Request } from 'express';
import type { ObjectId } from 'mongodb';

export enum ErrorCode {
    DUPLICATE_KEY = 11000,
}

export type RequestSession = Request['session'] & {
    jwt: string;
    rt: string;
};

export type CustomRequest = Omit<Request, 'session'> & {
    session: RequestSession;
};

export type SetupSessionParameters = {
    userId: ObjectId;
    jwt: string;
    rt: string;
};
