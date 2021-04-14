import {config} from '../config';

const {createLogger, format, transports} = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

const logDir = 'log';

// https://lovemewithoutall.github.io/it/winston-example/
// console창은 info 레벨부터 로그 남기고, 로그 파일에는 debug레벨부터 로그 남긴다
// 로그 파일 압축
// 개발 환경에서는 debug레벨부터, 운영에서는 info 레벨부터 로그 찍는다.
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    level: 'debug',
    filename: `${logDir}/%DATE%-smart-push.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const logger = createLogger({
    level: config.server.log.logLevel,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.json(),
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    (info: { timestamp: any; level: any; message: any; }) => `${info.timestamp} ${info.level}: ${info.message}`,
                ),
            ),
        }),
        dailyRotateFileTransport,
    ],
});

export {logger};
