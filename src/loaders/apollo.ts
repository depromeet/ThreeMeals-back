import { ApolloServer } from 'apollo-server-express';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import * as express from 'express';
import { AccountResolver, PostResolver, LikePostsResolver, EmoticonResolver } from '../resolvers';
import { config } from '../config';

export default async ({ app }: { app: express.Application }) => {
    const schema: GraphQLSchema = await buildSchema({
        resolvers: [AccountResolver, PostResolver, LikePostsResolver, EmoticonResolver],
        container: Container,
    });

    const server = new ApolloServer({
        schema: schema,
        playground: config.server.env !== 'production',
        introspection: config.server.env !== 'production',
        context: ({ req, res }) => {
            const context = {
                req,
            };
            return context;
        },
    });

    server.applyMiddleware({ app });
};
