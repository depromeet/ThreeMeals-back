import * as fs from 'fs';
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { config } from '../../config';
import * as WinstonDaily from 'winston-daily-rotate-file';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

const { combine, timestamp, label, printf, colorize, json } = format;

const logDir = 'log';

// https://lovemewithoutall.github.io/it/winston-example/
// console창은 info 레벨부터 로그 남기고, 로그 파일에는 debug레벨부터 로그 남긴다
// 로그 파일 압축
// 개발 환경에서는 debug레벨부터, 운영에서는 info 레벨부터 로그 찍는다.
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new WinstonDaily({
    level: 'debug',
    filename: `${logDir}/%DATE%-smart-push.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const consoleTransport = new transports.Console({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.printf(
            ({ level, message, label, timestamp }) => `${timestamp} ${level}: ${message}`,
        ),
    ),
} as ConsoleTransportOptions);

const logger = createLogger({
    level: config.server.log.logLevel,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.json(),
    ),
    transports: [
        consoleTransport,
        dailyRotateFileTransport,
    ],
} as LoggerOptions);

export { logger };
