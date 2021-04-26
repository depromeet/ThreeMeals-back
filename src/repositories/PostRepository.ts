import { Repository, EntityRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { Service } from 'typedi';


@Service()
@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    async createPost(newPost: Post): Promise<Post> {
        return await this.manager.save(newPost);
    }
}
