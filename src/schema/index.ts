import {muTypeDefs} from './_mutations';
import {typeDefs} from './_queries';
import {commentTypeDefs, commentResolvers} from './comment';
import {userTypeDefs, userResolvers} from './user';


export {
  muTypeDefs, typeDefs,
  commentTypeDefs, commentResolvers,
  userTypeDefs, userResolvers,
};

export default {
  muTypeDefs, typeDefs,
  commentTypeDefs, commentResolvers,
  userTypeDefs, userResolvers,
};
