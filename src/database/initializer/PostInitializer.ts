import {DataTypes, Sequelize} from 'sequelize';
import Post from '../../models/Post';
import Account from '../../models/Account';
import Comment from '../../models/Comment';
import Emoticon from '../../models/Emoticon';
import {ModelInitializer} from '../ModelInitializer';

export default class PostInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        Post.init({
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT, // 매우 긴 글
                allowNull: false,
            },
            post_type: {
                type: DataTypes.STRING(20), // 필수 아님
            },
            state: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            secret_type: {
                type: DataTypes.STRING(20),
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
        }, {
            sequelize,
            modelName: 'Post',
            tableName: 'post',
            charset: 'utf8mb4', //  한글+이모티콘
            collate: 'utf8mb4_general_ci',
        });
    }

    associate(sequelize: Sequelize): void {
        Post.hasMany(Comment,
            {foreignKey: 'post_id', sourceKey: 'id'});

        Post.belongsTo(Account,
            {foreignKey: 'account_id', targetKey: 'id'} );

        Post.belongsToMany(Account,
            {through: 'Like_Posts', foreignKey: 'post_id', sourceKey: 'id', as: 'likers_post'});

        Post.belongsToMany(Emoticon,
            {through: 'Post_Emoticon', foreignKey: 'post_id', sourceKey: 'id', as: 'using_emo'});
    }

    link(sequelize: Sequelize): void {}
}
