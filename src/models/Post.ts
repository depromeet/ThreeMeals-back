import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';
import User from './User';
import {Container} from 'typedi';

export interface PostAttributes {
    id: number;
    content: string;
}

@ObjectType()
export default class Post extends Model implements PostAttributes {

    @Field()
    public id!: number;

    @Field()
    public content!: string;

    @Field((type) => User)
    public readonly User?: User;
}

Container.set('post', Post);
