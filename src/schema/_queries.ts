import {gql} from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String!
    users: [user]
    user(id : Int): user
    comments: [comment]
  }
`;

export {typeDefs};
