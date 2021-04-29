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

    async createComment(args: { content: string; secretType: SecretType; postId: number }): Promise<Comment> {
        const post = await this.postRepository.getPost(args.postId);
        const newComment = new Comment();
        newComment.content = args.content;
        newComment.secretType = args.secretType;
        newComment.post = post;
        return await this.commentRepository.createComment(newComment);
    }
}
