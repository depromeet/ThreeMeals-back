import {gql} from 'apollo-server-express';
import User from '../models/user';
import {userService} from '../service';

import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';

const userTypeDefs = gql`
  scalar Date
  scalar DateTime
  type user {
    id: ID!
    nickname: String
    userId: String
    password: String
    createdAt: Date
    updatedAt: Date
    comments: [comment]
}

`;


const userResolvers = {
  Query: {

    users: async (parent: any, _args: any, context: any) => {
      const user = await userService.getAllUser();
      return user;
  },

    user: async (parent: any, _args: any, context: any) => {
      const user = await userService.getUser(_args);
      return user;
    },

  },

  // service로 query분리해야 함
  Mutation: {
    insertUsers: async (parent: any, _args: any) => {
       const user = await User.create(_args);
        return user;
    },
  },

};


export {
    userTypeDefs, userResolvers,
};
