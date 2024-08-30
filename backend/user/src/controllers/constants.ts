import type { CookieOptions } from 'express';
import config from 'config.json';

const { JWT_EXPIRY = 3600, RT_EXPIRY = 604800 } = process.env;
const now = Date.now();
const jwtExpiryInMS = Number(JWT_EXPIRY) * 1000;
export const rtExpiryInMS = Number(RT_EXPIRY) * 1000;
export const jwtExpiryDateTime = new Date(now + jwtExpiryInMS);
export const rtExpiryDateTime = new Date(now + rtExpiryInMS);

export const cookieConfig = {
    rt: {
        ...config.cookie.rt,
        expires: rtExpiryDateTime,
    },
} as Record<
    string,
    CookieOptions & {
        name: string;
    }
>;
