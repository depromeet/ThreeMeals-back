import Comment, {associate as associateComment} from './comment';
import Post, {associate as associatePost} from './post';
import User, {associate as associateUser} from './user';

export * from './sequelize';
const db = {
  Comment,
  Post,
  User,
};
export type dbType = typeof db;

associateComment(db);
associatePost(db);
associateUser(db);
