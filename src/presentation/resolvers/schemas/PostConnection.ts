import { Field, ObjectType } from 'type-graphql';
import { Post } from '../../../entities/Post';
import { Connection, Edge, PageInfo } from './base/Connection';

@ObjectType()
export class PostEdge extends Edge(Post, String) {}

@ObjectType()
export class PostPageInfo extends PageInfo(String) {}

@ObjectType()
export class PostConnection extends Connection<Post, 'id'> {
    @Field((type) => [PostEdge])
    edges: any;

    @Field((type) => PostPageInfo)
    pageInfo: any;
}
