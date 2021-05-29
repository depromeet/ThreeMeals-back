import * as _ from 'lodash';
import { filter, flow, map, uniq } from 'lodash/fp';
import { PostRepository } from '../repositories/PostRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { isEnum } from 'class-validator';
import { Comment } from '../entities/Comment';
import { CommentRepository } from '../repositories/CommentRepository';
import { Account } from '../entities/Account';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { CommentState, OXComment, PostState, PostType, SecretType } from '../entities/Enums';
import { EventPublisher } from '../EventPublisher';
import { CommentCreatedEvent } from './event/CommentCreatedEvent';

@Service()
export class CommentService {
    constructor(
        @InjectRepository()
        private readonly commentRepository: CommentRepository,
        @InjectRepository()
        private readonly postRepository: PostRepository,
        private readonly eventPublisher: EventPublisher,
    ) {}

    async createComment(args: {
        content: string;
        postId: string;
        parentId: string | null;
        secretType: SecretType;
        account: Account;
    }): Promise<Comment> {
        const { content, postId, parentId, secretType, account } = args;

        let parent: Comment | null = null;
        if (parentId) {
            // parentId 가 있다면 parent 가 있는지 체크
            const comment = await this.commentRepository.findOne({ id: parentId });
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

        const existedComment = await this.commentRepository.findOneByPostId(postId);

        await this.eventPublisher.publishAsync(
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

    async deleteComment(commentId: string, account: Account): Promise<void> {
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            throw new BaseError(ERROR_CODE.NOT_FOUND);
        }

        comment.delete(account.id);

        await this.commentRepository.save(comment);
    }
}
