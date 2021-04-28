import { ERROR_CODE } from '../exceptions/ErrorCode';
import { createErrorCode } from '../exceptions/ErrorCode';


class BaseError extends Error {
    type: { status: number, code: string, message: string; };
    constructor(type = ERROR_CODE.INTERNAL_SERVER_ERROR) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
    }
}

export default BaseError;

