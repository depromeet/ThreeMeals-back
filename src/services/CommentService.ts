import * as _ from 'lodash';
import {filter, flow, map, uniq} from 'lodash/fp';
import {PostRepository} from '../repositories/PostRepository';
import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {isEnum} from 'class-validator';
import {Comment} from '../entities/Comment';
import {CommentRepository} from '../repositories/CommentRepository';
import {Account} from '../entities/Account';
import {DeleteResult} from 'typeorm';
import BaseError from '../exceptions/BaseError';
import {ERROR_CODE} from '../exceptions/ErrorCode';
import {CommentState, OXComment, PostState, PostType, SecretType} from '../entities/Enums';

@Service()
export class CommentService {
    constructor(
        @InjectRepository()
        private readonly commentRepository: CommentRepository,
        @InjectRepository()
        private readonly postRepository: PostRepository,
    ) {}

    async createComment(args: {
        content: string,
        postId: string,
        parentId: string | null,
        secretType: SecretType,
        account: Account
    }): Promise<Comment> {
        const { content, postId, parentId, secretType, account } = args;
        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        // post 가 삭제된 상태인 경우 에러
        if (post.postState === PostState.Deleted) {
            console.error(`삭제된 Post 임: ${postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND, 'DELETED POST');
        }

        // postType 이 답해줘인 경우
        if (post.postType === PostType.Answer) {
            // 답변 다는 사람이 나라면 에러
            if (account.id === post.toAccountId) {
                console.error('답해줘에는 내가 쓸 수 없음');
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT);
            }
        }

        // postType 이 물어봐인경우
        if (post.postType === PostType.Ask) {
            // 답변 다는 사람이 내가 아니라면 에러
            if (account.id !== post.toAccountId) {
                console.error('물어봐에는 내가 아닌사람이 쓸 수 없음');
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT);
            }

            // comment 를 이미 달았다면 에러
            const existedComment = await this.commentRepository.findOneByPostId(postId);
            if (existedComment) {
                console.error(`이미 답변 달음, postId: ${postId}`);
                throw new BaseError(ERROR_CODE.ALREADY_COMMENT_SUBMITTED);
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
            const existedComment = await this.commentRepository.findOneByPostId(postId);
            if (existedComment) {
                console.error(`이미 답변 달음, postId: ${postId}`);
                throw new BaseError(ERROR_CODE.ALREADY_COMMENT_SUBMITTED);
            }
        }

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

        // post 의 state 변경
        if (post.postState !== PostState.Completed) {
            post.postState = PostState.Completed;
            await this.postRepository.save(post);
        }

        const newComment = new Comment();
        newComment.content = content;
        newComment.secretType = secretType;
        newComment.commentState = CommentState.Submitted;
        newComment.post = post;
        newComment.account = account;
        newComment.parent = parent;
        const result = await this.commentRepository.createComment(newComment);
        return result;
    }

    async getParentComments(args: {
        myAccountId: string | null,
        postId: string,
        limit: number,
        after: string | null
    }): Promise<Comment[]> {
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
            (parentCommentIds) => parentCommentIds.length > 0 ?
                this.commentRepository.getChildrenCountCommentsByIds(parentCommentIds) :
                Promise.resolve([]),
        )(comments);

        const result = _.chain(comments)
            .map((comment) => {
                comment.childrenCount = _.chain(childrenCounts)
                    .filter((count) => count.parentId === comment.id)
                    .map((count) => parseInt(count.childrenCount))
                    .reduce((prev, curr) => prev + curr, 0)
                    .value();
                return comment;
            }).map((comment) => {
                if (![post.toAccountId, args.myAccountId].includes(comment.accountId)) comment.account = null;
                return comment;
            }).value();
        return result;
    }

    async getChildrenComments(args: {
        myAccountId: string | null,
        postId: string,
        parentId: string,
        limit: number,
        after: string | null
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

    async deleteComment(commentId: string, account: Account): Promise<DeleteResult> {
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            throw new BaseError(ERROR_CODE.NOT_FOUND);
        }

        comment.validateCommentOwner(account.id);

        return await this.commentRepository.deleteOneById(commentId);
    }
}
