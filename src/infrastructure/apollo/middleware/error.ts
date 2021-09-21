import { MiddlewareFn } from 'type-graphql';
import { BaseError, IBaseError } from '../../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../../domain/exceptions/ErrorCode';
import { ILogger } from '../../logger/ILogger';
import { ApolloError } from 'apollo-server-express';
import { JsonLogger } from '../../logger/JsonLogger';

const logger: ILogger = new JsonLogger('ErrorInterceptor');

export const errorToBaseError = (error: Error): IBaseError => {
    return new BaseError({
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: error.message || ERROR_CODE.INTERNAL_SERVER_ERROR.message,
        stack: error.stack,
    });
};

export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
    try {
        return await next();
    } catch (err) {
        const baseError = err ?
            err instanceof BaseError ?
                err :
                errorToBaseError(err) :
            new BaseError({
                errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
                message: 'unknown error, please check error',
            });

        // write error to file log
        if (baseError.logMessage || baseError.errorData) {
            logger.error(
                baseError.logMessage ? baseError.logMessage : baseError.message,
                baseError.errorData,
                baseError.stack,
            );
        }

        // rethrow the error
        throw new ApolloError(baseError.message, baseError.code);
    }
};

// export class ErrorInterceptor implements MiddlewareInterface<AuthContext> {
//     private readonly logger: ILogger = new JsonLogger('ErrorInterceptor');
//
//     async use({ context, info }: ResolverData<AuthContext>, next: NextFn) {
//
//     }
// }
