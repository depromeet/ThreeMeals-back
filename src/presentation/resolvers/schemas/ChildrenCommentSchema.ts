import { Field, ID, ObjectType } from 'type-graphql';
import { CommentState, SecretType } from '../../../entities/Enums';
import { Connection, Edge, PageInfo } from './base/Connection';
import { Account } from '../../../entities/Account';
import { LikeComment } from '../../../entities/LikeComment';

@ObjectType('childrenComments')
export class ChildrenCommentSchema {
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

    @Field(() => String)
    parentId!: string | null;

    @Field(() => [LikeComment])
    likedComments!: LikeComment[];
}

@ObjectType()
export class ChildrenCommentEdge extends Edge(ChildrenCommentSchema, String) {}

@ObjectType()
export class ChildrenCommentPageInfo extends PageInfo(String) {}

@ObjectType()
export class ChildrenCommentConnection extends Connection<ChildrenCommentSchema, 'id'> {
    @Field((type) => [ChildrenCommentEdge])
    edges: any;

    @Field((type) => ChildrenCommentPageInfo)
    pageInfo: any;
}
