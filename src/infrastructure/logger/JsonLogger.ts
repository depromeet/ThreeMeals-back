import { createLogger, format, Logger, transports } from 'winston';
import { Service } from 'typedi';
import { id } from 'cls-rtracer';
import * as morgan from 'morgan';
import { Request } from 'express';
import { ILogger } from './ILogger';
import { config } from '../../config';

const { combine, timestamp, label, json, prettyPrint, metadata } = format;

const options = {
    prod: {
        level: 'info',
        handleExceptions: true,
        format: combine(
            timestamp(),
            label({ label: config.server.name }),
            json(),
        ),
    },
    dev: {
        level: 'debug',
        handleExceptions: true,
        format: combine(
            timestamp(),
            label({ label: config.server.name }),
            json(),
            prettyPrint(),
        ),
    },
};

@Service({ transient: true })
export class JsonLogger implements ILogger {
    private readonly source: string;
    private readonly logger: Logger;

    constructor(
        source?: string | Record<any, any>,
    ) {
        this.source = typeof source === 'string' ? source : source?.constructor?.name ? source?.constructor?.name : '';
        this.logger = createLogger({
            exitOnError: false,
            transports: [
                new transports.Console(
                    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ?
                        options.dev :
                        options.prod,
                ),
            ],
        });
    }

    private setMetaData<T>(args: {
        data?: T,
        context?: string,
        trace?: string,
    }): Record<string, any> {
        const { data, context, trace } = args;
        const rid = id();

        const metadata: Record<string, any> = {};

        context && (metadata['context'] = context);
        data && (metadata['data'] = data);
        rid && (metadata['requestId'] = rid);
        trace && (metadata['trace'] = trace);

        return metadata;
    }

    error(message: any, trace?: string, context?: string): any;
    error(message: any, trace?: string, context?: string): any;
    error<T>(message: any, data?: T, trace?: string): any {
        if (typeof data == 'string') {
            this.logger.error(message, this.setMetaData({ trace: data, context: trace }) );
        } else {
            this.logger.error(message, this.setMetaData({ data: data, context: this.source, trace: trace }));
        }
    }


    warn(message: any, context?: string): any;
    warn(message: any, data?: any): any;
    warn<T>(message: any, data?: T): any {
        if (typeof data == 'string') {
            this.logger.warn(message, this.setMetaData({ context: data }) );
        } else {
            this.logger.warn(message, this.setMetaData({ data: data, context: this.source }) );
        }
    }

    info<T>(message: any, data?: T): any {
        this.logger.info(message, this.setMetaData({ data: data, context: this.source }) );
    }

    log(message: any, context?: string): any {
        this.logger.info(message, this.setMetaData({ context: context }) );
    }

    debug(message: any, context?: string): any;
    debug(message: any, data?: any): any;
    debug<T>(message: any, data?: T): any {
        if (typeof data == 'string') {
            this.logger.debug(message, this.setMetaData({ context: data }) );
        } else {
            this.logger.debug(message, this.setMetaData({ data: data, context: this.source }) );
        }
    }

    verbose(message: any, context?: string): any;
    verbose(message: any, context?: any): any;
    verbose<T>(message: any, data?: T): any {
        if (typeof data == 'string') {
            this.logger.verbose(message, this.setMetaData({ context: data }) );
        } else {
            this.logger.verbose(message, this.setMetaData({ data: data, context: this.source }) );
        }
    }

    public morganMiddleware() {
        morgan.token('requestId', (req) => {
            return (req.headers['gameper-request-id'] as string) || 'null';
        });

        return morgan('combined', {
            stream: {
                write: (message: string) => this.log(message),
            },
            skip(req: Request, res): boolean {
                return req.path == '/ping';
            },
        });
    }
}
