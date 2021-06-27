import { CommandExecuter, ICommandExecuter } from '../../common/Command';
import { LikeCommentCommand } from './LikeCommentCommand';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CommentRepository } from '../../repositories/CommentRepository';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { PostRepository } from '../../repositories/PostRepository';
import { LikeComment } from '../../entities/LikeComment';
import { LikeCommentRepository } from '../../repositories/LikeCommentRepository';

@CommandExecuter(LikeCommentCommand)
export class LikeCommentCommandExecuter implements ICommandExecuter<LikeCommentCommand> {
    constructor(
        @InjectRepository() private readonly postRepository: PostRepository,
        @InjectRepository() private readonly commentRepository: CommentRepository,
        @InjectRepository() private readonly likeCommentRepository: LikeCommentRepository,
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