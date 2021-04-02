import {gql} from 'apollo-server-express';

const muTypeDefs = gql`
    type Mutation {
        insertUsers(
            nickname: String!
            userId: String!
            password: String!
          ): user
    }
`;


export {muTypeDefs};
