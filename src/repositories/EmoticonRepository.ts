import { Repository, EntityRepository } from 'typeorm';
import { Emoticon } from '../entities/Emoticon';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';


@Service()
@EntityRepository(Emoticon)
export class EmoticonRepository extends BaseRepository<Emoticon> {
    async getEmoticonId(emoticonId?: number): Promise<Emoticon | undefined> {
        const emoticon = await this.findOne(emoticonId, { select: ['id'] });

        return emoticon;
    }
}
