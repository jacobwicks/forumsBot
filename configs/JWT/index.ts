import { ExtractJwt } from 'passport-jwt';
import * as fs from 'fs';

export const privateKEY = fs.readFileSync(__dirname + '/private.key', 'utf8');
export const publicKEY = fs.readFileSync(__dirname + '/public.key', 'utf8');

export const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    signOptions: {
        issuer: 'sabot',
        subject: 'bot owner',
        audience: 'bot owner',
        expiresIn: '1h',
        algorithm: 'RS256',
    },
};
