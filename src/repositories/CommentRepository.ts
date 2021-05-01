import { Repository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { Comment } from '../entities/Comment';

@Service()
@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    async createComment(newComment: Comment): Promise<Comment> {
        return await this.manager.save(newComment);
    }

    async getCommentsByPostId(postId: string): Promise<Comment[]> {
        const comments = await this.find({ relations: ['post'] });
        return comments;
    }
}
