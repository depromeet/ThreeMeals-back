/* eslint-disable camelcase */
import {ModelInitializer} from '../ModelInitializer';
import {DataTypes, ModelAttributes, Sequelize} from 'sequelize';
import Post from '../../models/Post';
import Comment from '../../models/Comment';
import Account, {AccountAttributes} from '../../models/Account';

export default class UserInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        const attributes: ModelAttributes<Account, AccountAttributes> = {
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            nickname: {
                type: DataTypes.STRING(20), // 20글자 이하
                allowNull: false, // 필수
            },
            provider: {
                type: DataTypes.STRING(20), // 20글자 이하
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(20), // 20글자 이하
                allowNull: false,
            },
            provider_id: {
                type: DataTypes.STRING(100), // 100글자 이하
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(100), // 필수 아님
            },
            content: {
                type: DataTypes.STRING(200), // 필수 아님
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        };

        Account.init(attributes, {
            sequelize,
            modelName: 'Account',
            tableName: 'account',
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글
        });
    }

    associate(sequelize: Sequelize): void {
        Account.hasMany(Post,
            {foreignKey: 'user_id', sourceKey: 'id', as: 'Posts'});

        Account.hasMany(Comment,
            {foreignKey: 'user_id', sourceKey: 'id'});

        Account.belongsToMany(Post,
            {through: 'Like_Posts', foreignKey: 'user_id', sourceKey: 'id', as: 'likes_post'});

        Account.belongsToMany(Comment,
            {through: 'Like_Comments', foreignKey: 'user_id', sourceKey: 'id', as: 'likes_comment'});
    }

    link(sequelize: Sequelize): void {}
}
