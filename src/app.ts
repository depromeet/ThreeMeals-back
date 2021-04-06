import {Request, Response} from 'express';
import express from 'express';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-Parser';
import {ApolloServer} from 'apollo-server-express';

import {sequelize} from './models';
import * as middleware from './middleware';
import _resolvers from './_resolvers';
import _typedefs from './_typedefs';
import router from './router/index';

dotenv.config();

export const server: ApolloServer = new ApolloServer({
    typeDefs: _typedefs,
    resolvers: _resolvers,
    playground: true,
    introspection: true,
});


export class App {
    public app : express.Application;
    constructor() {
        this.app = express();

        // apollo
        this.apollo(this.app);

        // db 접속
        this.dbConnection();

        // 세션 셋팅
        this.setSession();

        // 미들웨어 셋팅
        this.setMiddleWare();

        // 정적 디렉토리 추가
        this.setStatic();

        // 라우팅
        this.getRouting();

        this.status404();

        this.errorHandler();
    }

    apollo(app : express.Application) {
        server.applyMiddleware({app});
    }


    dbConnection() {
        sequelize.sync({force: false})
            .then(() => {
                console.log('데이터베이스 연결 성공');
            })
            .catch((e: Error) => {
                console.error(e);
            });
    }

    setSession() {
        this.app.use(cookieParser(process.env.COOKIE_SECRET));
    }


    setMiddleWare() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }


    setStatic() {
        this.app.use('/', express.static('uploads'));
    }

    getRouting() {
        this.app.use(router);
    }

    status404() {
        this.app.use(middleware.notFound);
    }

    errorHandler() {
        this.app.use(middleware.errorHandler);
    }
}
