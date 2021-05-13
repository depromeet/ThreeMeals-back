import { PostRepository } from '../repositories/PostRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { isEnum } from 'class-validator';
import { Comment } from '../entities/Comment';
import { CommentRepository } from '../repositories/CommentRepository';
import { Account } from '../entities/Account';
import { DeleteResult } from 'typeorm';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { CommentState, OXComment, PostState, PostType, SecretType } from '../entities/Enums';

@Service()
export class CommentService {
    constructor(
        @InjectRepository()
        private readonly commentRepository: CommentRepository,
        @InjectRepository()
        private readonly postRepository: PostRepository,
    ) {}

    async createComment(args: { content: string; postId: string, secretType: SecretType, account: Account }): Promise<Comment> {
        const { content, postId, secretType, account } = args;
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        // postType 이 물어봐인경우
        if (post.postType === PostType.Ask) {
            // 답변 다는 사람이 내가 아니라면 에러
            if (account.id !== post.toAccountId) {
                console.error('물어봐에는 내가 아닌사람이 쓸 수 없음');
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT);
            }

            // comment 를 이미 달았다면 에러
            const existedComments = await this.commentRepository.findOneByPostId(postId);
            if (existedComments.length > 0) {
                console.error(`이미 답변 달음, postId: ${postId}`);
                throw new BaseError(ERROR_CODE.ALREADY_COMMENT_SUBMITTED);
            }
        }

        // postType 이 답해줘인 경우
        if (post.postType === PostType.Answer) {
            // 답변 다는 사람이 나라면 에러
            if (account.id === post.toAccountId) {
                console.error('답해줘에는 내가 쓸 수 없음');
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT);
            }
        }

        // postType 이 OX 인 경우
        if (post.postType === PostType.Quiz) {
            // 답변 다는 사람이 내가 아니라면 에러
            if (account.id !== post.toAccountId) {
                console.error('OX 에는 다른사람이 쓸 수 없음');
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT);
            }

            // 답변이 O,X 가 아니라면 에러
            if (!isEnum(content, OXComment)) {
                console.error(`OX 에는 OX 만이 들어갈 수 있음, content: ${content}`);
                throw new BaseError(ERROR_CODE.INVALID_OX_COMMENT_CONTENT);
            }

            // comment 를 이미 달았다면 에러
            const existedComments = await this.commentRepository.findOneByPostId(postId);
            if (existedComments.length > 0) {
                console.error(`이미 답변 달음, postId: ${postId}`);
                throw new BaseError(ERROR_CODE.ALREADY_COMMENT_SUBMITTED);
            }
        }

        // post 의 state 변경
        post.postState = PostState.Completed;

        const newComment = new Comment();
        newComment.content = content;
        newComment.secretType = secretType;
        newComment.commentState = CommentState.Submitted;
        newComment.post = post;
        newComment.account = account;
        await this.postRepository.save(post);
        const result = await this.commentRepository.createComment(newComment);
        return result;
    }

    async getCommentsByPostId(args: {
        accountId: string,
        postId: string,
        limit: number,
        after: string | null
    }): Promise<Comment[]> {
        const comments = await this.commentRepository.findOneByPostId(args.postId);
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
