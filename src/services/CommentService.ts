import { PostRepository } from '../repositories/PostRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Comment } from '../entities/Comment';
import { CommentRepository } from '../repositories/CommentRepository';
import { Account } from '../entities/Account';
import { DeleteResult } from 'typeorm';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';

@Service()
export class CommentService {
    constructor(
        @InjectRepository()
        private readonly commentRepository: CommentRepository,
        @InjectRepository()
        private readonly postRepository: PostRepository,
    ) {}

    async createComment(args: { content: string; postId: string }, account: Account): Promise<Comment> {
        const post = await this.postRepository.getPost(args.postId);
        const newComment = new Comment();
        newComment.content = args.content;
        newComment.post = post;
        newComment.account = account;
        const result = await this.commentRepository.createComment(newComment);

        return result;
    }

    async getCommentsByPostId(postId: string): Promise<Comment[]> {
        const comments = await this.commentRepository.getCommentsByPostId(postId);
        return comments;
    }

    async deleteComment(commentId: string, account: Account): Promise<DeleteResult> {
        const comment = await this.commentRepository.getCommentById(commentId);
        if (!comment) {
            throw new BaseError(ERROR_CODE.NOT_FOUND);
        }

        const isOwner = await this.isCommentOwner(comment, account);

        if (!isOwner) {
            throw new BaseError(ERROR_CODE.FORBIDDEN);
        }

        return await this.commentRepository.deleteOneById(commentId);
    }

    async isCommentOwner(comment: Comment, account: Account): Promise<boolean> {
        if (comment.account.id === account.id) return true;
        else return false;
    }
}
