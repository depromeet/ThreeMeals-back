import {Sequelize} from 'sequelize';
import {config} from '../config';
import {logger} from '../logger/winston';
import sequelize from '../database/Sequelize';
import {modelInitializers} from '../database/ModelInitializer';

export default async (): Promise<Sequelize> => {
    // model initialize
    modelInitializers.forEach((initializer) => initializer.init(sequelize));
    modelInitializers.forEach((initializer) => initializer.associate(sequelize));
    modelInitializers.forEach((initializer) => initializer.link(sequelize));

    // sequelize sync
    await sequelize.sync({
        force: config.db.default.synchronize && config.db.default.dropSchema,
        alter: config.db.default.synchronize && config.db.default.dropSchema,
    })
        .then(() => logger.info('데이터베이스 연결 성공'))
        .catch((e: Error) => {
            logger.error(e);
        });

    return sequelize;
};
