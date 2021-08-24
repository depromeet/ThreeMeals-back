import 'reflect-metadata';
import * as express from 'express';
import apolloLoader from '../infrastructure/apollo/apollo';
import expressLoader, { loadHandleError } from '../infrastructure/express/express';
import infrastructureLoader from '../infrastructure/unit-of-work/loadUnitOfWork';
import eventEmitterLoader from '../infrastructure/typedi/event-emitter';
import commandLoader from '../infrastructure/typedi/command';
import dbConnection from '../infrastructure/typeorm/typeorm';
import { logger } from '../infrastructure/logger/winston';
import { config } from '../config';

const startApiServer = async () => {
    const app = express();
    expressLoader({ app });
    await apolloLoader({ app });
    await dbConnection();

    await infrastructureLoader();
    await eventEmitterLoader();
    await commandLoader();
    loadHandleError({ app });

    app.listen(config.server.port, () => {
        logger.info(`Server ready at http://localhost:${config.server.port}`);
    });
};

startApiServer().catch((err) => logger.error(`Fail to start server, err: ${err.message}`));

// new App().app.listen({port: PORT}, () =>
//     console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`),
// );
