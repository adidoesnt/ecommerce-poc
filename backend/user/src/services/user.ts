import type { Request } from 'express';
import { Logger } from 'utils';
import { User } from 'models';
import { userRepository } from 'repositories';
import { ObjectId, type MongoError } from 'mongodb';
import { ControllerError, RES } from 'controllers/types';
import { ErrorCode } from './types';
import { LoginType } from 'models/user';

const { SALT_ROUNDS = 10 } = process.env;

const logger = new Logger({
    module: 'services/user',
});

enum ErrorMessage {
    USER_ALREADY_EXISTS = 'User already exists',
}

export const checkRequiredFields = (body: Request['body']) => {
    const requiredFields: (keyof User)[] = ['firstName', 'lastName', 'email'];

    if (!body.loginType) {
        requiredFields.push('password');
    }

    const missingFields = requiredFields.filter(
        (field) => body[field] === undefined || body[field] === null,
    );

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
        const { password, ...newUser } = body;
        if (password) {
            const censoredPassword = password?.replace(/./g, '*');
            logger.info('Adding user with data:', {
                ...newUser,
                password: censoredPassword,
            });
            const hashedPassword = await Bun.password.hash(password, {
                algorithm: 'bcrypt',
                cost: Number(SALT_ROUNDS),
            });
            newUser.password = hashedPassword;
        }
        const user = await userRepository.createOne(newUser);
        logger.info('Added user with data:', newUser);
        return user;
    } catch (e) {
        const error = e as MongoError;
        const { code } = error;
        logger.error('Error adding user:', error as Error);
        throwControllerError(code as ErrorCode);
    }
};

export const findUserById = async (id: string) => {
    try {
        const _id = new ObjectId(id);
        return await userRepository.findOne({ _id });
    } catch (e) {
        const error = e as MongoError;
        const { code } = error;
        logger.error('Error finding user by id:', error as Error);
        throwControllerError(code as ErrorCode);
    }
};

export const findUserByEmail = async (email: string) => {
    try {
        return await userRepository.findOne({
            email,
        });
    } catch (e) {
        const error = e as MongoError;
        const { code } = error;
        logger.error('Error finding user by email:', error as Error);
        throwControllerError(code as ErrorCode);
    }
};

export const checkPassword = async (password: string, user: User) => {
    try {
        const { loginType } = user;
        if (loginType !== LoginType.LOCAL) {
            logger.warn('Password not required for Google login');
            return true;
        }
        const isPasswordValid = await Bun.password.verify(
            password,
            user.password as string,
            'bcrypt',
        );
        return isPasswordValid;
    } catch (error) {
        logger.error('Error checking password:', error as Error);
        throwControllerError();
    }
};

export const throwControllerError = (code?: ErrorCode) => {
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
