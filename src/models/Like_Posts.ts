/* eslint-disable camelcase */
import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';

export interface Like_PostsAttributes {
    id: number;
    account_id: number;
    post_id: number;
    createdAt: Date;
}

@ObjectType()
export default class Like_Posts extends Model implements Like_PostsAttributes {
    @Field()
    public id!: number;

    @Field()
    public account_id!: number;

    @Field()
    public post_id!: number;

    @Field()
    public createdAt!: Date;
}

