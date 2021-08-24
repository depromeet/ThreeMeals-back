import { sign, SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';

export interface JWTPayload {
    id: string;
    iss: string;
}

export const issueJWT = async (id: string): Promise<string> => {
    const jwtOptions: SignOptions = {
        expiresIn: config.jwt.expiresIn,
    };

    const payload: JWTPayload = {
        id: id,
        iss: config.jwt.iss,
    };

    try {
        return await signAsync(payload, jwtOptions);
    } catch (error) {
        throw new BaseError(ERROR_CODE.JWT_SIGN_ERROR);
    }
};

export const signAsync = async (payload: JWTPayload, jwtOptions: SignOptions): Promise<string> =>
    new Promise<string>(((resolve, reject) => {
        sign(payload,
            config.jwt.secret,
            jwtOptions,
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    token ? resolve(token) : reject(new BaseError(ERROR_CODE.JWT_SIGN_ERROR));
                }
            });
    }));
