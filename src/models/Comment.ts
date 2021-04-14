/* eslint-disable camelcase */
import {Model} from 'sequelize';
import {Field, ObjectType} from 'type-graphql';

export interface CommentAttributes {
    id: number;
    content: string;
    parent_id: number;
    secret_type: string;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export default class Comment extends Model implements CommentAttributes {
    @Field()
    public id!: number;

    @Field()
    public content!: string;

    @Field()
    public parent_id!: number;

    @Field()
    public secret_type!: string;

    @Field()
    public createdAt!: Date;

    @Field()
    public updatedAt!: Date;
}
