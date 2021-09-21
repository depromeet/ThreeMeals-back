import { ERROR_CODE } from './ErrorCode';


class BaseError extends Error {
    type: { status: number, code: string, message: string; };
    constructor(type = ERROR_CODE.INTERNAL_SERVER_ERROR, message?: string) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.type = {
            status: type.status,
            code: type.code,
            message: message ? message : type.message,
        };
    }
}

export default BaseError;

