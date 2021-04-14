import {Sequelize} from 'sequelize';
import {config} from '../config';
import {logger} from '../logger/winston';

const sequelize = new Sequelize({
    dialect: config.db.default.dialect as any,
    database: config.db.default.database,
    username: config.db.default.username,
    password: config.db.default.password,
    host: config.db.default.host,
    port: config.db.default.port,
    logging: config.db.default.logging ? (msg) => logger.info(msg) : false,
    pool: {
        max: config.db.default.maximumPoolSize,
        min: 0,
        idle: config.db.default.idlePoolSize,
    },
    dialectOptions: {
        // timeout: config.db.default.connectionTimeout,
    },
});

export {sequelize};
export default sequelize;
