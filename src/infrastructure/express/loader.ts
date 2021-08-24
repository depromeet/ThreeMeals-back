import * as express from 'express';
import * as cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import { config } from '../../config';
import { logger } from '../logger/winston';
import { handle404Error, handleError } from './middlewares/error';
import { TypeOrmDBContext } from "../type-orm/TypeOrmDBContext";

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
    // app.use(handleUserAgent);
    app.use((req, res, next) => {
        TypeOrmDBContext.createWithEmitters([req, res], next);
    });
    //
    // app.use(async (req, res, next) => {
    //     const oldSend = res.send;
    //     res.send = function(data) {
    //         const queryRunner = TypeOrmDBContext.getQueryRunner();
    //         if (queryRunner && !queryRunner.isReleased) {
    //             queryRunner.release();
    //         }
    //         res.send = oldSend;
    //         return res.send(data);
    //     };
    //     next();
    // });

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
