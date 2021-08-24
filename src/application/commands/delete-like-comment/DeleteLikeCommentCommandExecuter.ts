import { CommandExecuter, ICommandExecuter } from '../Command';
import { DeleteLikeCommentCommand } from './DeleteLikeCommentCommand';
import { CommentRepository } from '../../../infrastructure/repositories/CommentRepository';
import { LikeCommentRepository } from '../../../infrastructure/repositories/LikeCommentRepository';
import BaseError from '../../../exceptions/BaseError';
import { ERROR_CODE } from '../../../exceptions/ErrorCode';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';

@CommandExecuter(DeleteLikeCommentCommand)
export class DeleteLikeCommentCommandExecuter implements ICommandExecuter<DeleteLikeCommentCommand> {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository,
        private readonly likeCommentRepository: LikeCommentRepository,
    ) {}

    async execute(command: DeleteLikeCommentCommand): Promise<any> {
        const { accountId, commentId } = command;
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            throw new BaseError(ERROR_CODE.COMMENT_NOT_FOUND);
        }

        const post = await this.postRepository.findOneById(comment.postId);
        if (!post) {
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }
        if (accountId !== post.toAccountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        await this.likeCommentRepository.deleteLikes(comment);
    }
}
