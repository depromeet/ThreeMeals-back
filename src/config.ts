import * as dotenv from 'dotenv';

dotenv.config();

export interface IConfig {
    server: {
        port: string;
        name: string;
        env: string;
        log: {
            useFile: boolean;
            logLevel: string;
            filepath: string;
        },
    };
    db: {
        default: {
            connectionName: string;
            dialect: string;
            username: string;
            password: string;
            database: string;
            host: string;
            port: number;
            maximumPoolSize: number;
            idlePoolSize: number;
            connectionTimeout: number;
            synchronize: boolean;
            dropSchema: boolean;
            logging: boolean;
        }
    };

    cookie: {
        secret: string;
    };

    jwt: {
        secret: string;
        expiresIn: string;
        iss: string;
    }
}

export const config: IConfig = {
    server: {
        port: process.env.PORT || '4000',
        name: process.env.SERVER_NAME || 'three_meals-server',
        env: process.env.NODE_ENV || 'development',
        log: {
            useFile: process.env.LOG_USE_FILE === 'true',
            logLevel: process.env.LOG_LEVEL || 'debug',
            filepath: process.env.LOG_FILE_PATH || '/data/three_meals/logs',
        },
    },
    db: {
        default: {
            connectionName: process.env.DB_DEFAULT_CONNECTION_NAME || 'default',
            dialect: process.env.DB_DEFAULT_TYPE || 'mysql',
            username: process.env.DB_DEFAULT_USERNAME || '',
            password: process.env.DB_DEFAULT_PASSWORD || '',
            database: process.env.DB_DEFAULT_DATABASE ||'three_meals',
            host: process.env.DB_DEFAULT_HOST || '127.0.0.1',
            port: process.env.DB_DEFAULT_PORT ?
                parseInt(process.env.DB_DEFAULT_PORT) :
                3306,
            maximumPoolSize: process.env.DB_DEFAULT_MAXIMUM_POOL_SIZE ?
                parseInt(process.env.DB_DEFAULT_MAXIMUM_POOL_SIZE) :
                30,
            idlePoolSize: process.env.DB_DEFAULT_IDLE_POOL_SIZE ?
                parseInt(process.env.DB_DEFAULT_IDLE_POOL_SIZE) :
                5000,
            connectionTimeout: process.env.DB_DEFAULT_CONNECTION_TIMEOUT ?
                parseInt(process.env.DB_DEFAULT_CONNECTION_TIMEOUT) :
                10000,
            logging: process.env.DB_DEFAULT_LOGGING === 'true',
            dropSchema: process.env.DB_DEFAULT_DROP_SCHEMA === 'true',
            synchronize: process.env.DB_DEFAULT_SYNCHRONIZE === 'true',
        },
    },

    cookie: {
        secret: process.env.COOKIE_SECRET || '',
    },

    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRATION || '7d',
        iss: process.env.JWT_ISS || 'accounts.depromeet.com',
    },
};
