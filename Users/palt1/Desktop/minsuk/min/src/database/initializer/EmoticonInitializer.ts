import {DataTypes, Sequelize} from 'sequelize';
import Post from '../../models/Post';
import Emoticon from '../../models/Emoticon';

import {ModelInitializer} from '../ModelInitializer';

export default class EmoticonInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        Emoticon.init({
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            file_url: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Emoticon',
            tableName: 'emoticon',
            charset: 'utf8mb4', //  한글+이모티콘
            collate: 'utf8mb4_general_ci',
        });
    }

    associate(sequelize: Sequelize): void {
        Emoticon.belongsToMany(Post,
            {through: 'Post_Emoticon', foreignKey: 'emoticon_id', sourceKey: 'id', as: 'used_emo'});
    }

    link(sequelize: Sequelize): void {}
}

