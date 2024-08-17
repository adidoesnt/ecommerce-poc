import type { Request } from 'express';
import { Logger } from 'utils';
import { hash } from 'bcrypt';
import { User } from 'models';
import { userRepository } from 'repositories';
import type { MongoError } from 'mongodb';
import { ControllerError, RES } from 'controllers/types';
import { ErrorCode } from './types';

const { SALT_ROUNDS = 10 } = process.env;

const logger = new Logger({
    module: 'services/user',
});

enum ErrorMessage {
    USER_ALREADY_EXISTS = 'User already exists',
}

export const checkRequiredFields = (body: Request['body']) => {
    const requiredFields: (keyof User)[] = [
        'firstName',
        'lastName',
        'email',
        'areaCode',
        'phone',
        'password',
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
        const missingFieldsString = missingFields.join(', ');
        const message = `Missing required fields: ${missingFieldsString}`;
        const { status } = RES.BAD_REQUEST;
        throw new ControllerError(message, { status });
    }
};

export const addUser = async (body: Request['body']) => {
    checkRequiredFields(body);
    try {
        const { password, ...rest } = body;
        const censoredPassword = password?.replace(/./g, '*');
        logger.info('Adding user with data:', {
            ...rest,
            password: censoredPassword,
        });
        const hashedPassword = password
            ? await hash(password, SALT_ROUNDS)
            : null;
        const newUser = {
            ...rest,
            password: hashedPassword,
        } as User;
        await userRepository.createOne(newUser);
        logger.info('Added user with data:', newUser);
    } catch (e) {
        const error = e as MongoError;
        const { code } = error;
        logger.error('Error adding user:', error as Error);
        console.log(error);
        throwControllerError(code as ErrorCode);
    }
};

export const throwControllerError = (code: ErrorCode) => {
    switch (code) {
        case ErrorCode.DUPLICATE_KEY:
            throw new ControllerError(ErrorMessage.USER_ALREADY_EXISTS, {
                status: RES.CONFLICT.status,
            });
        default:
            throw new ControllerError(RES.INTERNAL_SERVER_ERROR.message, {
                status: RES.INTERNAL_SERVER_ERROR.status,
            });
    }
};
