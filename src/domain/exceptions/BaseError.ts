import { ERROR_CODE, ErrorCode, isErrorCode } from './ErrorCode';

export interface IBaseError extends Error {
    status: number;
    code: string;
    message: string;
    logMessage?: string;
    errorData?: unknown;
    toString(): string;
}

export class BaseError extends Error implements IBaseError {
    name: string;
    message: string;
    logMessage?: string;
    status: number;
    code: string;
    stack?: string;
    errorData?: unknown;

    constructor(errorConstructor: {
        errorCode?: ErrorCode;
        message?: string;
        errorData?: unknown;
        stack?: string;
    } | ErrorCode) {
        super();
        if (isErrorCode(errorConstructor)) {
            Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
            const errorCode = errorConstructor;
            this.status = errorCode.status;
            this.message = errorCode.message;
            this.name = errorCode.code;
            this.code = errorCode.code;
            this.logMessage = errorCode.message;
            this.errorData = { };
        } else {
            const { errorCode = ERROR_CODE.INTERNAL_SERVER_ERROR, message, errorData, stack } = errorConstructor;
            if (stack) {
                this.stack = stack;
            } else if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            }
            this.status = errorCode.status;
            this.message = errorCode.message;
            this.name = errorCode.code;
            this.code = errorCode.code;
            this.logMessage = message || errorCode.message;
            this.errorData = errorData;
        }
        Object.setPrototypeOf(this, BaseError.prototype);
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

export default BaseError;

