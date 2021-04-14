import {Service} from 'typedi';
import Comment from '../models/Comment';

@Service()
export class CommentService {
    async getAllCommentsByUserId(userId: number): Promise<Comment[]> {
        const comments = await Comment.findAll({
            where: {
                userId,
            },
        });
        return comments;
    }
}
