import {Field, ObjectType} from 'type-graphql';
import {HasManyGetAssociationsMixin, Model} from 'sequelize';
import Post from './Post';
import Comment from './Comment';
import {Container} from 'typedi';

export interface UserAttributes {
    id: number;
    userId: string;
    nickname: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

@ObjectType()
export default class User extends Model implements UserAttributes {
    @Field()
    public id!: number;

    @Field()
    public userId!: string;

    @Field()
    public nickname!: string;

    @Field()
    public password!: string;

    @Field()
    public createdAt!: Date;

    @Field()
    public updatedAt!: Date;

    @Field((type) => [Post])
    public Posts?: Post[];

    @Field((type) => [Comment])
    public comments?: Comment[];

    public getPosts!: HasManyGetAssociationsMixin<Post>;
    public getComments!: HasManyGetAssociationsMixin<Comment>;
}

Container.set('user', User);
