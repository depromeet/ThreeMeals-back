import { CommandExecuter, ICommandExecuter } from '../Command';
import { LikeCommentCommand } from './LikeCommentCommand';
import { CommentRepository } from '../../../infrastructure/repositories/CommentRepository';
import BaseError from '../../../exceptions/BaseError';
import { ERROR_CODE } from '../../../exceptions/ErrorCode';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { LikeComment } from '../../../entities/LikeComment';
import { LikeCommentRepository } from '../../../infrastructure/repositories/LikeCommentRepository';

@CommandExecuter(LikeCommentCommand)
export class LikeCommentCommandExecuter implements ICommandExecuter<LikeCommentCommand> {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository,
        private readonly likeCommentRepository: LikeCommentRepository,
    ) {}

    async execute(command: LikeCommentCommand): Promise<any> {
        const { likerId, commentId, postId } = command;
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            throw new BaseError(ERROR_CODE.COMMENT_NOT_FOUND);
        }
        if (postId !== comment.postId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        if (comment.likedComments.length > 0) {
            throw new BaseError(ERROR_CODE.ALREADY_COMMENT_LIKE);
        }

        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }
        if (likerId !== post.toAccountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        const likeComment = new LikeComment();
        likeComment.accountId = likerId;
        likeComment.comment = comment;

        await this.likeCommentRepository.addLike(likeComment);
    }
}
