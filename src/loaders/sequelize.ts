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
    if (config.db.default.synchronize) {
        await sequelize.sync().then(() => logger.info('데이터베이스 연결 성공'));
    } else {
        await sequelize.authenticate().then(() => logger.info('데이터베이스 연결 성공'));
    }

    return sequelize;
};
