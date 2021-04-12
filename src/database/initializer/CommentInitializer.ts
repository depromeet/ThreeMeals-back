import {DataTypes, Sequelize} from 'sequelize';
import Comment from '../../models/Comment';
import User from '../../models/User';
import {ModelInitializer} from '../ModelInitializer';

export default class CommentInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {
        Comment.init({
            content: {
                type: DataTypes.TEXT, // 긴 글
                allowNull: false,
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
        Comment.belongsTo(User,
            {as: 'Owner', foreignKey: 'userId', targetKey: 'id'} );
    }

    link(sequelize: Sequelize): void {}
}
