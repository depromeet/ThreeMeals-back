import { Field, ObjectType } from 'type-graphql';
import { Connection, Edge, PageInfo } from './base/Connection';
import { Comment } from '../entities/Comment';

@ObjectType()
export class CommentEdge extends Edge(Comment, String) {}

@ObjectType()
export class CommentPageInfo extends PageInfo(String) {}

@ObjectType()
export class CommentConnection extends Connection<Comment, 'id'> {
    @Field((type) => [CommentEdge])
    edges: any;

    @Field((type) => CommentPageInfo)
    pageInfo: any;
}
