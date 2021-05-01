import { Repository, EntityRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { Service } from 'typedi';

@Service()
@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    async createPost(newPost: Post): Promise<Post> {
        return await this.manager.save(newPost);
    }

    async getPost(postId: number): Promise<Post> {
        return await this.findOneOrFail({ id: postId });
    }

    async getPostId(postId: number): Promise<Post | undefined> {
        const account = await this.findOne(postId, { select: ['id'] });

        return account;
    }
}
