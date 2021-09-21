import { Service } from 'typedi';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { BaseError, IBaseError } from '../../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../../domain/exceptions/ErrorCode';
import { AuthContext } from '../../express/middlewares/AuthContext';
import { Logger } from '../../typedi/decorator/Logger';
import { ILogger } from '../../logger/ILogger';
import { ApolloError } from 'apollo-server-express';

export const errorToBaseError = (error: Error): IBaseError => {
    return new BaseError({
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: error.message || ERROR_CODE.INTERNAL_SERVER_ERROR.message,
        stack: error.stack,
    });
};

@Service()
export class ErrorInterceptor implements MiddlewareInterface<AuthContext> {
    constructor(
        @Logger() private readonly logger: ILogger,
    ) {
    }

    async use({ context, info }: ResolverData<AuthContext>, next: NextFn) {
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
                this.logger.error(
                    baseError.logMessage ? baseError.logMessage : baseError.message,
                    baseError.errorData,
                    baseError.stack,
                );
            }

            // rethrow the error
            throw new ApolloError(baseError.message, baseError.code);
        }
    }
}
