import { Repository, EntityRepository } from 'typeorm';
import { Emoticon } from '../entities/Emoticon';
import { Service } from 'typedi';


@Service()
@EntityRepository(Emoticon)
export class EmoticonRepository extends Repository<Emoticon> {
    async getEmoticonId(emoticonId?: number): Promise<Emoticon | undefined> {
        const emoticon = await this.findOne(emoticonId, { select: ['id'] });

        return emoticon;
    }
}
