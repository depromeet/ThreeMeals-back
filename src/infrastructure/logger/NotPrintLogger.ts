import { ILogger } from './ILogger';

export class NotPrintLogger implements ILogger {
    debug<T>(message: any, data?: T): any {
        // do nothing
    }

    error<T>(message: any, data?: T, trace?: string): any {
        // do nothaing
    }

    info<T>(message: any, data?: T): any {
        // do nothing
    }

    verbose<T>(message: any, data?: T): any {
        // do nothing
    }

    warn<T>(message: any, data?: T): any {
        // do nothing
    }

}
