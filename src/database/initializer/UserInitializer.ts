import {ModelInitializer} from '../ModelInitializer';
import {DataTypes, ModelAttributes, Sequelize} from 'sequelize';
import Post from '../../models/Post';
import Comment from '../../models/Comment';
import User, {UserAttributes} from '../../models/User';

export default class UserInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        const attributes: ModelAttributes<User, UserAttributes> = {
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true, // 고유한 값
            },
            nickname: {
                type: DataTypes.STRING(20), // 20글자 이하
                allowNull: false, // 필수
            },
            password: {
                type: DataTypes.STRING(100), // 100글자 이하
                allowNull: false,
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

        User.init(attributes, {
            sequelize,
            modelName: 'User',
            tableName: 'user',
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글
        });
    }

    associate(sequelize: Sequelize): void {
        User.hasMany(Post, {foreignKey: 'userId',
            sourceKey: 'id', as: 'Posts'});

        User.hasMany(Comment, {foreignKey: 'userId',
            sourceKey: 'id', as: 'Comment'});
    }

    link(sequelize: Sequelize): void {}
}
