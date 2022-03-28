import * as express from 'express';
import * as cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import { expressMiddleware as rTracerExpressMiddlewares } from 'cls-rtracer';
import { config } from '../../config';
import { JsonLogger } from '../logger/JsonLogger';
import { handle404Error, handleError } from './middlewares/error';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { serve, setup } from 'swagger-ui-express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { AccountController } from '../../presentation/controllers/AccountController';

export const expressLoader = async (app: express.Application) => {
    app.set('etag', false);
    app.set('trust proxy', true);

    // helmet 에 의해 gql playground 가 나오지 않아 production 에서만 설정
    if (config.server.env === 'production') {
        app.use(helmet());
    }
    app.use(cors());
    app.use(cookieParser(config.cookie.secret));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rTracerExpressMiddlewares());
    const routingControllersOptions = {
        controllers: [__dirname + '../../presentation/controllers/*.{ts,js}'],
        routePrefix: '/api',
    };
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
        components: {
            // schemas,
            securitySchemes: {
                basicAuth: {
                    scheme: 'basic',
                    type: 'http',
                },
            },
        },
        info: {
            description: 'Generated with `routing-controllers-openapi`',
            title: 'A sample API',
            version: '1.0.0',
        },
    });

    app.use('/docs', serve, setup(spec));

    app.use(
        morgan('combined', {
            skip: function(req, res) {
                return req.path === '/ping';
            },
            stream: {
                write: (message) => new JsonLogger('morgan').info(message),
            },
        }),
    );

    app.get('/ping', (req, res, next) => {
        return res.status(200).send('pong');
    });

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    app.use('/', express.static('uploads'));
};

export const loadHandleError = ({ app }: { app: express.Application }) => {
    app.use(handle404Error);
    app.use(handleError);
};
