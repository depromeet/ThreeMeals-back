import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { ApolloServerLoaderPlugin } from 'type-graphql-dataloader';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import * as express from 'express';
import { config } from '../../config';
import { ErrorInterceptor } from './middleware/error';

export const createSchema = async (): Promise<GraphQLSchema> => {
    const schema: GraphQLSchema = await buildSchema({
        resolvers: [__dirname + '/../../**/resolvers/*.{ts,js}'],
        container: Container,
        globalMiddlewares: [ErrorInterceptor],
    });
    return schema;
};

export const apolloLoader = async (app: express.Application, schema: GraphQLSchema): Promise<ApolloServer> => {
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

    return server;
};
