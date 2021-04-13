import {DataTypes, Sequelize} from 'sequelize';
import Post from '../../models/Post';
import User from '../../models/User';
import {ModelInitializer} from '../ModelInitializer';

export default class PostInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        Post.init({
            content: {
                type: DataTypes.TEXT, // 매우 긴 글
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Post',
            tableName: 'post',
            charset: 'utf8mb4', //  한글+이모티콘
            collate: 'utf8mb4_general_ci',
        });
    }

    associate(sequelize: Sequelize): void {
        Post.belongsTo(User,
            {as: 'Owner', foreignKey: 'userId', targetKey: 'id'} );
    }

    link(sequelize: Sequelize): void {}
}
