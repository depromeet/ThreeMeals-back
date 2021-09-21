import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { getDefaultDBOrmConfig } from './ormconfig';
import { config } from '../../config';
import { JsonLogger } from '../logger/JsonLogger';

const logger = new JsonLogger('createConnection');

export default async (): Promise<Connection> => {
    const connection = await createConnection(getDefaultDBOrmConfig(config));
    logger.info(`database ${config.db.default.database} connection created`);
    return connection;
};
