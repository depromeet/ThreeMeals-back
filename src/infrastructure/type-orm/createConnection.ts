import 'reflect-metadata';
import {Connection, createConnection} from 'typeorm';
import { logger } from '../logger/winston';
import { getDefaultDBOrmConfig } from './ormconfig';
import { config } from '../../config';

export default async (): Promise<Connection> => {
    const connection = await createConnection(getDefaultDBOrmConfig(config));
    logger.info(`database ${config.db.default.database} connection created`);
    return connection
};
