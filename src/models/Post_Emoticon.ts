/* eslint-disable camelcase */
import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';

export interface Post_EmoticonAttributes {
    id: number;
    position_x: number;
    position_y: number;
    content: number;
    rotate: number;
    width: number;
    height: number;
    post_id: number;
    emoticon_id: number;
}

@ObjectType()
export default class Post_Emoticon extends Model implements Post_EmoticonAttributes {
    @Field()
    public id!: number;

    @Field()
    public position_x!: number;

    @Field()
    public position_y!: number;

    @Field()
    public content!: number;

    @Field()
    public rotate!: number;

    @Field()
    public width!: number;

    @Field()
    public height!: number;

    @Field()
    public post_id!: number;

    @Field()
    public emoticon_id!: number;
}

