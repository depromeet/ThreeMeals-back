import { ILogger } from "./ILogger";

export class ConsoleLogger implements ILogger {
    debug<T>(message: any, data?: T): any {
        console.log(message, data);
    }

    error<T>(message: any, data?: T, trace?: string): any {
        console.log(message, data, trace);
    }

    info<T>(message: any, data?: T): any {
        console.log(message, data);
    }

    verbose<T>(message: any, data?: T): any {
        console.log(message, data);
    }

    warn<T>(message: any, data?: T): any {
        console.log(message, data);
    }

}
