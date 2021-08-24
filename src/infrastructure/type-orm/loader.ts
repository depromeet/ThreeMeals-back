import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { logger } from '../logger/winston';
import { getDefaultDBOrmConfig } from './ormconfig';
import { config } from '../../config';
import { TypeOrmUnitOfWork } from './TypeOrmUnitOfWork';

const loadUnitOfWork = async ([]: any) => {
    // do nothing
};

export default async (): Promise<void> => {
    await createConnection(getDefaultDBOrmConfig(config));
    logger.info(`database ${config.db.default.database} connection created`);

    await loadUnitOfWork([
        TypeOrmUnitOfWork,
    ]);
};
