import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { logger } from '../logger/winston';
const PORT = process.env.PORT || 5000;

const dbConnection = async (): Promise<void> => {
  createConnection()
    .then(() => {
      logger.info(
        `database ${process.env.DB_DEFAULT_DATABASE} connection created`,
      );
    })
    .catch((error: Error) => {
      logger.info(`Database connection failed with error ${error}`);
    });
};

export default dbConnection;
