import * as express from 'express';
import * as cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import { config } from '../config';
import { handleUserAgent } from '../middleware/express/user-agent';
import { logger } from '../logger/winston';
import { handle404Error, handleError } from '../middleware/express/error';
import router from '../routers';
import { DBContext } from '../infrastructure/DBContext';

export default ({ app }: { app: express.Application }) => {
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
    app.use(
        morgan('combined', {
            skip: function(req, res) {
                return req.path === '/ping';
            },
            stream: {
                write: (message) => logger.info(message),
            },
        }),
    );
    app.use(handleUserAgent);
    app.use((req, res, next) => {
        DBContext.create([req, res], next);
    });

    app.get('/ping', (req, res, next) => {
        return res.status(200).end('pong');
    });

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    app.use('/', express.static('uploads'));
    app.use(router);
};

export const loadHandleError = ({ app }: { app: express.Application }) => {
    app.use(handle404Error);
    app.use(handleError);
};
