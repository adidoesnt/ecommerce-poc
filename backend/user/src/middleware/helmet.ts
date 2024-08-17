import helmet, { type HelmetOptions } from 'helmet';
import type { Express } from 'express';
import config from 'config.json';
import { Logger } from 'utils';

const { NODE_ENV = 'DEV' } = process.env;
const { helmet: helmetConfig } = config;

const logger = new Logger({
    module: 'middleware/helmet',
});

export const setupHelmet = (app: Express) => {
    const isDev = NODE_ENV === 'DEV';

    // options
    const contentSecurityPolicy = isDev
        ? false
        : helmetConfig.contentSecurityPolicy;
    const hsts = isDev ? false : helmetConfig.hsts;
    const referrerPolicy =
        helmetConfig.referrerPolicy as HelmetOptions['referrerPolicy'];
    const frameguard = (
        isDev
            ? {
                  action: 'sameorigin',
              }
            : helmetConfig.frameguard
    ) as HelmetOptions['frameguard'];
    const xssFilter = true;
    const noSniff = true;

    const helmetOptions = {
        contentSecurityPolicy,
        hsts,
        referrerPolicy,
        frameguard,
        xssFilter,
        noSniff,
    };

    logger.info('Setting up helmet middleware with options:', helmetOptions);

    app.use(helmet(helmetOptions));
};
