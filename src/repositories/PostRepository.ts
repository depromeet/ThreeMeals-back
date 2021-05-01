import { Repository, EntityRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { Service } from 'typedi';

@Service()
@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    async createPost(newPost: Post): Promise<Post> {
        return await this.manager.save(newPost);
    }


    async getPostById(postId: string): Promise<Post | undefined> {
        const post = await this.findOne(postId, { select: ['id'] });
        return post;
    }

    async getPost(postId: string): Promise<Post> {
        return await this.findOneOrFail({ id: postId });
    }
}
