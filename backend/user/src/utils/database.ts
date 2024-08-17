import mongoose, { type ConnectOptions } from 'mongoose';
import config from 'config.json';
import { Logger } from './logger';

const { MONGODB_URI = 'dummy-uri' } = process.env;

const logger = new Logger({
    module: 'utils/database',
});

export class Database {
    uri: string;
    config: ConnectOptions;

    constructor(uri: string) {
        logger.info('Creating database instance with config:', {
            uri,
            ...config.mongoose,
        });
        this.uri = uri;
        this.config = config.mongoose as ConnectOptions;
    }

    async connect() {
        logger.info('Connecting to database...');
        await mongoose.connect(this.uri);
        logger.info('Connected to database');
    }
}

export const database = new Database(MONGODB_URI);
