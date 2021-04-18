import { IConfig } from './config';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

export const getDefaultDBOrmConfig = (config: IConfig): ConnectionOptions => {
    return {
        name: config.db.default.connectionName,
        type: config.db.default.dialect as any,
        database: config.db.default.database,
        synchronize: config.db.default.synchronize,
        dropSchema: config.db.default.dropSchema,
        logging: config.db.default.logging,
        host: config.db.default.host,
        port: config.db.default.port,
        username: config.db.default.username,
        password: config.db.default.password,
        entities: [`${__dirname}/**/entities/**/*{.ts,.js}`],
        connectTimeout: config.db.default.connectionTimeout,
        extra: {
            charset: 'utf8mb4_general_ci',
            connectionLimit: config.db.default.maximumPoolSize,
        },
    };
};
