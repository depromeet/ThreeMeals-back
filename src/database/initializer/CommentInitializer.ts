import {DataTypes, Sequelize} from 'sequelize';
import Comment from '../../models/Comment';
import Post from '../../models/Post';
import Account from '../../models/Account';
import {ModelInitializer} from '../ModelInitializer';

export default class CommentInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        Comment.init({
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT, // 긴 글
                allowNull: false,
            },
            parent_id: {
                type: DataTypes.INTEGER, // 필수 아님
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
            modelName: 'Comment',
            tableName: 'comment',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    associate(sequelize: Sequelize): void {
        Comment.belongsTo(Account,
            {foreignKey: 'user_id', targetKey: 'id'} );

        Comment.belongsTo(Post,
            {foreignKey: 'post_id', targetKey: 'id'} );

        Comment.belongsToMany(Account,
            {through: 'Like_Comments', foreignKey: 'comment_id', sourceKey: 'id', as: 'likers_comment'});
    }

    link(sequelize: Sequelize): void {}
}
