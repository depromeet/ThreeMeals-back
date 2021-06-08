import { Repository, EntityRepository, SaveOptions, DeepPartial } from 'typeorm';
import { PostEmoticon } from '../entities/PostEmoticon';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';


@Service()
@EntityRepository(PostEmoticon)
export class PostEmoticonRepository extends BaseRepository<PostEmoticon> {
    async savePostEmoticon(newPostEmoticon: PostEmoticon): Promise<PostEmoticon> {
        return await this.entityManager.save(newPostEmoticon);
    }

    async savePostEmoticons(newPostEmoticons: PostEmoticon[]): Promise<PostEmoticon[]> {
        return await this.entityManager.save(newPostEmoticons);
    }

    async listPostEmoticonByPostIds(postIds: string[]): Promise<PostEmoticon[]> {
        const postEmoticon = 'postEmoticon';
        const queryBuilder = this.createQueryBuilder(postEmoticon);
        const positEmoticons = await queryBuilder
            .leftJoinAndSelect(`${postEmoticon}.emoticon`, 'emoticon')
            .where(`${postEmoticon}.post_id IN (:...postIds)`, { postIds })
            .getMany();
        return positEmoticons.map((postEmoticon) => {
            postEmoticon.fileUrl = postEmoticon.emoticon ? postEmoticon.emoticon.fileUrl : null;
            postEmoticon.name = postEmoticon.emoticon ? postEmoticon.emoticon.name : null;
            return postEmoticon;
        });
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
