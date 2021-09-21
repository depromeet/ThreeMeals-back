import * as _ from 'lodash';
import { filter, flow, map, uniq } from 'lodash/fp';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { Service } from 'typedi';
import { Comment } from '../../entities/Comment';
import { CommentRepository } from '../../infrastructure/repositories/CommentRepository';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';
import { CommentState, SecretType } from '../../entities/Enums';
import { EventPublisher } from '../../infrastructure/event-publishers/EventPublisher';
import { CommentCreatedEvent } from '../../domain/events/CommentCreatedEvent';
import { CommentDeletedEvent } from '../../domain/events/CommentDeletedEvent';

@Service()
export class CommentService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository,
        private readonly eventPublisher: EventPublisher,
    ) {}

    async createComment(args: {
        content: string;
        postId: string;
        parentId: string | null;
        secretType: SecretType;
        account: AccountOrmEntity;
    }): Promise<Comment> {
        const { content, postId, parentId, secretType, account } = args;

        let parent: Comment | null = null;
        if (parentId) {
            // parentId 가 있다면 parent 가 있는지 체크
            const comment = await this.commentRepository.findOneById(parentId);
            if (!comment) {
                console.error(`부모 댓글이 없습니다. parentId: ${parentId}`);
                throw new BaseError(ERROR_CODE.COMMENT_NOT_FOUND);
            }
            comment.validateParentComment(postId);
            parent = comment;
        }

        const newComment = new Comment();
        newComment.content = content;
        newComment.secretType = secretType;
        newComment.commentState = CommentState.Submitted;
        newComment.postId = postId;
        newComment.account = account;
        newComment.parent = parent;

        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${args.postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        const existedComment = await this.commentRepository.findOneByPostIdAndCommentState(postId, CommentState.Submitted);

        await this.eventPublisher.dispatchAsync(
            new CommentCreatedEvent({
                postId: postId,
                content: content,
                accountId: account.id,
                otherAccountId: post.fromAccountId,
                postType: post.postType,
                isUniqueComment: !existedComment,
            }),
        );

        const result = await this.commentRepository.saveComment(newComment);

        return result;
    }

    async getParentComments(args: { myAccountId: string | null; postId: string; limit: number; after: string | null }): Promise<Comment[]> {
        const post = await this.postRepository.findOneById(args.postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${args.postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        const comments = await this.commentRepository.listParentByPostId({
            postId: args.postId,
            limit: args.limit,
            after: args.after,
        });

        const childrenCounts = await flow(
            filter<Comment>((comment) => comment.parentId === null),
            map((comment) => comment.id as string),
            uniq,
            (parentCommentIds) =>
                parentCommentIds.length > 0 ? this.commentRepository.getChildrenCountCommentsByIds(parentCommentIds) : Promise.resolve([]),
        )(comments);

        const result = _.chain(comments)
            .map((comment) => {
                comment.childrenCount = _.chain(childrenCounts)
                    .filter((count) => count.parentId === comment.id)
                    .map((count) => parseInt(count.childrenCount))
                    .reduce((prev, curr) => prev + curr, 0)
                    .value();
                return comment;
            })
            .map((comment) => {
                if (![post.toAccountId, args.myAccountId].includes(comment.accountId)) comment.account = null;
                return comment;
            })
            .value();
        return result;
    }

    async getChildrenComments(args: {
        myAccountId: string | null;
        postId: string;
        parentId: string;
        limit: number;
        after: string | null;
    }): Promise<Comment[]> {
        const post = await this.postRepository.findOneById(args.postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${args.postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        const comments = await this.commentRepository.listChildrenByParentIdAndPostId({
            parentId: args.parentId,
            postId: args.postId,
            limit: args.limit,
            after: args.after,
        });
        comments.map((comment) => {
            if (![post.toAccountId, args.myAccountId].includes(comment.accountId)) comment.account = null;
            return comment;
        });

        return comments;
    }

    async deleteComment(commentId: string, account: AccountOrmEntity): Promise<void> {
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            throw new BaseError(ERROR_CODE.NOT_FOUND);
        }

        comment.delete(account.id);

        await this.eventPublisher.dispatchAsync(
            new CommentDeletedEvent({
                postId: comment.postId,
                content: comment.content,
                accountId: account.id,
            }),
        );

        await this.commentRepository.saveComment(comment);
    }

    async getAllCommentsByPostId(postId: string): Promise<any> {
        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        // 부모댓글
        const comments = await (await this.commentRepository.allCommentsByPostId({ postId: postId })).map((comment) => {
            if (comment.accountId != post.toAccountId) {
                comment.account = null;
            }
            return comment;
        });

        // 자식놈들
        let childrenComments = await this.commentRepository.listChildrenByPostId({ postId: postId });

        childrenComments = await Promise.all(
            childrenComments.map((data) => {
                if (data.account && data.account.id != post.toAccountId) {
                    data.account.id == post.toAccountId;
                    data.account = null;
                }
                return data;
            }),
        );

        // 가족 찾기
        const allComments = await Promise.all(
            comments.map((data) => {
                data.children = childrenComments.filter((child) => {
                    return child.parentId === data.id;
                });
                return data;
            }),
        );

        return allComments;
    }
}
