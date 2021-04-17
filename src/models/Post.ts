/* eslint-disable camelcase */
import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';
import Account from './Account';

export interface PostAttributes {
    id: number;
    content: string;
    post_type: string;
    state: string;
    color: string;
    secret_type: string;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export default class Post extends Model implements PostAttributes {
    @Field()
    public id!: number;

    @Field()
    public content!: string;

    @Field()
    public post_type!: string;

    @Field()
    public state!: string;

    @Field()
    public color!: string;

    @Field()
    public secret_type!: string;

    @Field()
    public createdAt!: Date;

    @Field()
    public updatedAt!: Date;

    @Field((type) => Account)
    public readonly Account?: Account;
}
