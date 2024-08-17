import type { Request } from 'express';
import { Logger } from 'utils';
import { hash } from 'bcrypt';
import { User } from 'models';
import { userRepository } from 'repositories';

const { SALT_ROUNDS = 10 } = process.env;

const logger = new Logger({
    module: 'services/user',
});

export const addUser = async (body: Request['body']) => {
    try {
        const { password, ...rest } = body;
        const censoredPassword = password.replace(/./g, '*');
        logger.info('Adding user with data:', {
            ...rest,
            password: censoredPassword,
        });
        const hashedPassword = await hash(password, SALT_ROUNDS);
        const newUser = {
            ...rest,
            password: hashedPassword,
        } as User;
        await userRepository.createOne(newUser);
        logger.info('Added user with data:', newUser);
    } catch (error) {
        logger.error('Error adding user:', error as Error);
        throw error;
    }
};
