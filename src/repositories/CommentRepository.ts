import { Repository, EntityRepository, DeleteResult } from 'typeorm';
import { Service } from 'typedi';
import { Comment } from '../entities/Comment';
import { Account } from '../entities/Account';

@Service()
@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    async createComment(newComment: Comment): Promise<Comment> {
        return await this.manager.save(newComment);
    }

    async getCommentsByPostId(postId: string): Promise<Comment[]> {
        const comments = await this.find({ where: { post: postId }, relations: ['post'] });
        return comments;
    }

    async deleteOneById(commentId: string): Promise<DeleteResult> {
        const result = await this.delete({ id: commentId });
        return result;
    }

    async getCommentById(commentId: string) {
        return await this.findOne({ id: commentId }, { relations: ['account'] });
    }
}
