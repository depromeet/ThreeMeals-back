import { PostRepository } from '../repositories/PostRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Comment } from '../entities/Comment';
import { SecretType } from '../entities/Enums';
import { CommentRepository } from '../repositories/CommentRepository';
import { PostService } from './PostService';
@Service()
export class CommentService {
    constructor(
        @InjectRepository()
        private readonly commentRepository: CommentRepository,
        @InjectRepository()
        private readonly postRepository: PostRepository,
    ) {}

    async createComment(args: { content: string; postId: number }): Promise<Comment> {
        const post = await this.postRepository.getPost(args.postId);
        console.log(post);
        const newComment = new Comment();
        newComment.content = args.content;
        newComment.post = post;
        const result = await this.commentRepository.createComment(newComment);
        console.log(result);
        return result;
    }

    async getCommentsByPostId(postId: number): Promise<Comment[]> {
        const comments = await this.commentRepository.getCommentsByPostId(postId);
        return comments;
    }
}
