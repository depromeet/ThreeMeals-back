import { Repository, EntityRepository, SaveOptions, DeepPartial } from 'typeorm';
import { PostEmoticon } from '../entities/PostEmoticon';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';


@Service()
@EntityRepository(PostEmoticon)
export class PostEmoticonRepository extends BaseRepository<PostEmoticon> {
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
}
