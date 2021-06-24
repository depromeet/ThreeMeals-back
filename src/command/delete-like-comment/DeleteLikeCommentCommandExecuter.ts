import { CommandExecuter, ICommandExecuter } from '../../common/Command';
import { DeleteLikeCommentCommand } from './DeleteLikeCommentCommand';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CommentRepository } from '../../repositories/CommentRepository';
import { LikeCommentRepository } from '../../repositories/LikeCommentRepository';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { PostRepository } from '../../repositories/PostRepository';

@CommandExecuter(DeleteLikeCommentCommand)
export class DeleteLikeCommentCommandExecuter implements ICommandExecuter<DeleteLikeCommentCommand> {
    constructor(
        @InjectRepository() private readonly postRepository: PostRepository,
        @InjectRepository() private readonly commentRepository: CommentRepository,
        @InjectRepository() private readonly likeCommentRepository: LikeCommentRepository,
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
