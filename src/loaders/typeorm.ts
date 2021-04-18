import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { logger } from '../logger/winston';
import { getDefaultDBOrmConfig } from '../ormconfig';
import { config } from '../config';

const dbConnection = async (): Promise<void> => {
    createConnection(getDefaultDBOrmConfig(config)).then(() => {
        logger.info(
            `database ${process.env.DB_DEFAULT_DATABASE} connection created`,
        );
    });
};

export default dbConnection;
