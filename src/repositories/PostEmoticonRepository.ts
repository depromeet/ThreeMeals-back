import { Repository, EntityRepository } from 'typeorm';
import { PostEmoticon } from '../entities/PostEmoticon';
import { Service } from 'typedi';


@Service()
@EntityRepository(PostEmoticon)
export class PostEmoticonRepository extends Repository<PostEmoticon> {
    async createPostEmoticon(newPostEmoticon: PostEmoticon): Promise<PostEmoticon> {
        return await this.manager.save(newPostEmoticon);
    }

    async getPostEmoticonId(postEmoticonId: number): Promise<PostEmoticon | undefined> {
        const postEmoticon = await this.findOne(postEmoticonId, { select: ['id'] });

        return postEmoticon;
    }

    async getPostEmoticonIdbyObject(id: PostEmoticon): Promise<PostEmoticon | undefined> {
        const postEmoticon = await this.findOne(id, { select: ['id'] });

        return postEmoticon;
    }
}
