import NotFoundException from '../exceptions/notFoundException';
import {gql} from 'apollo-server-express';
import Comment from '../models/comment';

import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';

const commentTypeDefs = gql`
   type comment {
    id: ID!
    content: String
    createdAt: Date
    updatedAt: Date
    userId: String
}

`;

const commentResolvers = {
    Query: {
        comments: async (parent: any, _args: any, context: any) => {
          const comment = await Comment.findAll({});
          if (!comment) {
            throw new NotFoundException('no comment');
          }
          return comment;
      },
    },
  };


export {
  commentTypeDefs, commentResolvers,
};
