import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';
import { logger } from '../logger/winston';
import { getDefaultDBOrmConfig } from '../ormconfig';
import { config } from '../config';

export default async (): Promise<void> => {
    useContainer(Container);
    await createConnection(getDefaultDBOrmConfig(config));
    logger.info(`database ${process.env.DB_DEFAULT_DATABASE} connection created`);
};
