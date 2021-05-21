import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { ApolloServerLoaderPlugin } from 'type-graphql-dataloader';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import * as express from 'express';
import { AccountResolver, PostResolver, LikePostsResolver, EmoticonResolver, CommentResolver, ContactResolver } from '../resolvers';
import { config } from '../config';
import { NotificationResolver } from '../resolvers/NotificationResolver';

export default async ({ app }: { app: express.Application }) => {
    const schema: GraphQLSchema = await buildSchema({
        resolvers: [
            AccountResolver,
            PostResolver,
            LikePostsResolver,
            EmoticonResolver,
            CommentResolver,
            ContactResolver,
            NotificationResolver,
        ],
        // resolvers: [__dirname + '../resolvers/*.{ts,js}'],
        container: Container,
    });

    const server = new ApolloServer({
        uploads: false,
        schema: schema,
        playground: config.server.env !== 'production',
        introspection: config.server.env !== 'production',
        plugins: [
            ApolloServerLoaderPlugin(),
        ],
        context: ({ req, res }) => {
            const context = {
                req,
            };
            return context;
        },
    } as ApolloServerExpressConfig);

    server.applyMiddleware({ app });
};
