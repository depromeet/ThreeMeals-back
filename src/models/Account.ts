/* eslint-disable camelcase */
import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';
import Post from './Post';
import Comment from './Comment';

export interface AccountAttributes {
    id: number;
    nickname: string;
    provider: string;
    status: string;
    provider_id: string;
    image: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export default class Account extends Model implements AccountAttributes {
    @Field()
    public id!: number;

    @Field()
    public nickname!: string;

    @Field()
    public provider!: string;

    @Field()
    public status!: string;

    @Field()
    public provider_id!: string;

    @Field()
    public image!: string;

    @Field()
    public content!: string;

    @Field()
    public createdAt!: Date;

    @Field()
    public updatedAt!: Date;

    @Field((type) => [Post])
    public Posts?: Post[];

    @Field((type) => [Comment])
    public comments?: Comment[];
}
