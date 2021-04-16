/* eslint-disable camelcase */
import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';

export interface Like_CommentsAttributes {
    id: number;
    account_id: number;
    comment_id: number;
    createdAt: Date;
}

@ObjectType()
export default class Like_Comments extends Model implements Like_CommentsAttributes {
    @Field()
    public id!: number;

    @Field()
    public account_id!: number;

    @Field()
    public comment_id!: number;

    @Field()
    public createdAt!: Date;
}

