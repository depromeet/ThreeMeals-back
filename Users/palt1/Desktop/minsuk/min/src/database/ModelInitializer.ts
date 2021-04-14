import {Sequelize} from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

export interface ModelInitializer {
    init(sequelize: Sequelize): void
    associate(sequelize: Sequelize): void
    link(sequelize: Sequelize): void
}

const initializerPath = `${__dirname}/initializer/`;
export const modelInitializers: ModelInitializer[] = fs.readdirSync(initializerPath)
    .filter((file) => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .map((file) => require(path.join(initializerPath, file)))
    .map((Initializer) => new Initializer.default());
