import { PostEmoticon } from '../../entities/PostEmoticon';
import { Service } from 'typedi';
import { BaseRepository } from '../type-orm/BaseRepository';

@Service()
export class PostEmoticonRepository extends BaseRepository<PostEmoticon> {
    async listPostEmoticonByPostIds(postIds: string[]): Promise<PostEmoticon[]> {
        const postEmoticon = 'postEmoticon';
        const queryBuilder = this.entityManager.createQueryBuilder(PostEmoticon, postEmoticon);
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
