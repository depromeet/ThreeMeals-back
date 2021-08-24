import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { logger } from '../logger/winston';
import { getDefaultDBOrmConfig } from './ormconfig';
import { config } from '../../config';

export default async (): Promise<void> => {
    await createConnection(getDefaultDBOrmConfig(config));
    logger.info(`database ${config.db.default.database} connection created`);
};
