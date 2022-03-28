import 'reflect-metadata';
import * as express from 'express';
import { createSchema, apolloLoader } from '../infrastructure/apollo/loader';
import { expressLoader, loadHandleError } from '../infrastructure/express/loader';
import typediLoader from '../infrastructure/typedi';
import typeOrmLoader from '../infrastructure/type-orm/createConnection';
import { config } from '../config';
import { JsonLogger } from '../infrastructure/logger/JsonLogger';
import { createExpressServer } from 'routing-controllers';


const logger = new JsonLogger('www');

const startApiServer = async () => {
    const app = createExpressServer({
        routePrefix: '/api',
        controllers: [__dirname + '/../**/controllers/*.{ts,js}'],
    });
    await expressLoader(app);

    // graphql
    const gqlSchema = await createSchema();
    await apolloLoader(app, gqlSchema);
    await typeOrmLoader();

    await typediLoader();
    loadHandleError({ app });

    app.listen(config.server.port, () => {
        logger.info(`Server ready at http://localhost:${config.server.port}`);
    });
};

startApiServer().catch((err) => logger.error(`Fail to start server, err: ${err.message}`));

// new App().app.listen({port: PORT}, () =>
//     console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`),
// );
