export enum ErrorCode {
    DUPLICATE_KEY = 11000,
}

export type ServiceError = Error & { code: ErrorCode };