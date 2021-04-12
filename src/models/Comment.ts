import {Model} from 'sequelize';
import {Field, ObjectType} from 'type-graphql';
import Container from 'typedi';

export interface CommentAttributes {
    id: number;
    content: string;
}

@ObjectType()
export default class Comment extends Model implements CommentAttributes {
    @Field()
    public id!: number;

    @Field()
    public content!: string;
}

Container.set('comment', Comment);
