import { Field, ObjectType } from 'type-graphql';
import { PostType } from '../entities/Enums';

@ObjectType()
export class PostCount {
    @Field(() => PostType)
    postType!: PostType;

    @Field()
    count!: number;
}

@ObjectType()
export class NewPostCount {
    @Field(() => [PostCount])
    postCount!: PostCount[];

    constructor(postCount: PostCount[]) {
        this.postCount = postCount;
    }
}
