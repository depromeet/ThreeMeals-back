export abstract class ILogger {
    abstract error<T>(message: any, data?: T, trace?: string): any;
    abstract warn<T>(message: any, data?: T): any;
    abstract info<T>(message: any, data?: T): any;
    abstract debug<T>(message: any, data?: T): any;
    abstract verbose<T>(message: any, data?: T): any;
}
