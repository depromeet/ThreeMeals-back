/* eslint-disable camelcase */
import {DataTypes, Sequelize} from 'sequelize';
import Post from '../../models/Post';
import Post_Emoticon from '../../models/Post_Emoticon';

import {ModelInitializer} from '../ModelInitializer';

export default class Post_EmoticonInitializer implements ModelInitializer {
    init(sequelize: Sequelize): void {}

    associate(sequelize: Sequelize): void {
    }

    link(sequelize: Sequelize): void {
        Post_Emoticon.init({
            id: {
                field: 'id',
                primaryKey: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
            },
            position_x: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            position_y: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(30), // 값이 없을 수도
            },
            rotate: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            width: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            height: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            emoticon_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Post_Emoticon',
            tableName: 'post_emoticon',
            charset: 'utf8mb4', //  한글+이모티콘
            collate: 'utf8mb4_general_ci',
        });
    }
}

