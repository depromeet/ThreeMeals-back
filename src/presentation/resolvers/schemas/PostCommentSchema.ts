import { Field, ID, ObjectType } from 'type-graphql';
import { CommentState, SecretType } from '../../../entities/Enums';
import { AccountOrmEntity } from '../../../entities/AccountOrmEntity';

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

    @Field((type) => AccountOrmEntity, { nullable: true })
    account!: AccountOrmEntity | null;

    @Field()
    postId!: string;
}
