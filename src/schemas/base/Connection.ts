import { ClassType, Field, ObjectType } from 'type-graphql';
import * as _ from 'lodash';

class PageInfoBase<C> {
    endCursor!: C | null;
    hasNextPage: boolean;

    constructor(endCursor: C | null, hasNextPage: boolean) {
        this.endCursor = endCursor;
        this.hasNextPage = hasNextPage;
    }
}

export function PageInfo<C>(endCursor: ClassType<C>) {
    @ObjectType({ isAbstract: true })
    class PageInfoClass extends PageInfoBase<C> {
        @Field((type) => endCursor, { nullable: true })
        endCursor!: C | null;

        @Field()
        hasNextPage!: boolean;
    }
    return PageInfoClass;
}

// export class PageInfo<C> {
//     endCursor!: C | null;
//     hasNextPage: boolean;
//
//     constructor(endCursor: C | null, hasNextPage: boolean) {
//         this.endCursor = endCursor;
//         this.hasNextPage = hasNextPage;
//     }
// }

// export class Edge<T, C> {
//     node!: T;
//     cursor: C;
//
//     constructor(node: T, cursor: C) {
//         this.node = node;
//         this.cursor = cursor;
//     }
// }

class EdgeBase<T, C> {
    node!: T;
    cursor: C;

    constructor(node: T, cursor: C) {
        this.node = node;
        this.cursor = cursor;
    }
}

export function Edge<T, C>(node: ClassType<T>, cursor: ClassType<C>) {
    @ObjectType({ isAbstract: true })
    class EdgeClass extends EdgeBase<T, C> {
        @Field((type) => node)
        node!: T;

        @Field((type) => cursor)
        cursor!: C;
    }
    return EdgeClass;
}

export class Connection<T, K extends keyof T> {
    edges: EdgeBase<T, T[K]>[];
    pageInfo: PageInfoBase<T[K]>;

    constructor(edgeModels: T[], cursorKey: K) {
        this.edges = edgeModels.map((m) => new EdgeBase<T, T[K]>(m, m[cursorKey]));

        const hasNextPage = edgeModels.length > 0;
        const last: T | undefined = _.last(edgeModels);
        const endCursor = last ? last[cursorKey] : null;
        this.pageInfo = new PageInfoBase<T[K]>(endCursor, hasNextPage);
    }
}
