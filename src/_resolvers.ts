import merge from 'lodash.merge';
import Example from './schema';

export default merge(
    Example.commentResolvers, Example.userResolvers,
);
