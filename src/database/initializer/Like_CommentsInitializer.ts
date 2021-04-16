/* eslint-disable camelcase */
import {DataTypes, Sequelize} from 'sequelize';
import Like_Comments from '../../models/Like_Comments';

import {ModelInitializer} from '../ModelInitializer';

export default class Like_CommentsInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {}

    associate(sequelize: Sequelize): void {

    }

    link(sequelize: Sequelize): void {
        Like_Comments.init({
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'Like_Comments',
            tableName: 'like_comments',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
}

