/* eslint-disable camelcase */
import {DataTypes, Sequelize} from 'sequelize';
import Like_Posts from '../../models/Like_Posts';

import {ModelInitializer} from '../ModelInitializer';

export default class Post_EmoticonInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {}

    associate(sequelize: Sequelize): void {
    }

    link(sequelize: Sequelize): void {
        Like_Posts.init({
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
            post_id: {
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
            modelName: 'Like_Posts',
            tableName: 'like_posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
}

