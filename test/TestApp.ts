import * as express from 'express';
import { createTestClient } from 'apollo-server-testing';
import { expressLoader, loadHandleError } from '../src/infrastructure/express/loader';
import { createSchema, apolloLoader } from '../src/infrastructure/apollo/loader';
import typeOrmLoader from '../src/infrastructure/type-orm/createConnection';
import typediLoader from '../src/infrastructure/typedi';
import { Connection } from 'typeorm';

export class TestApp {
    private _instance: express.Express
    get instance() {
        return this._instance;
    }

    private dbConnection?: Connection;

    constructor() {
        this._instance = express();
    }

    async setUp() {
        console.log('SetUp Test App...');
        await expressLoader(this._instance);

        const gqlSchema = await createSchema();
        await apolloLoader(this._instance, gqlSchema);

        this.dbConnection = await typeOrmLoader();

        await typediLoader();

        loadHandleError({ app: this._instance });
    }

    async down() {
        console.log('Down Test App...');
        await this.dbConnection?.dropDatabase();
        await this.dbConnection?.close();
    }
}
