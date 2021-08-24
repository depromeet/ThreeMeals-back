import { Field, ID, ObjectType } from 'type-graphql';
import { CommentState, SecretType } from '../../../entities/Enums';
import { Account } from '../../../entities/Account';

@ObjectType('comments')
export class PostCommentSchema {
    @Field(() => ID)
    id!: string;

    @Field()
    content!: string;

    @Field((type) => SecretType)
    secretType!: SecretType;

    @Field((type) => CommentState)
    commentState!: CommentState;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;

    @Field((type) => Account, { nullable: true })
    account!: Account | null;

    @Field()
    postId!: string;
}
