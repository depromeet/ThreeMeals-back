import { Emoticon } from '../../entities/Emoticon';
import { Service } from 'typedi';
import { BaseRepository } from '../type-orm/BaseRepository';

@Service()
export class EmoticonRepository extends BaseRepository<Emoticon> {
    async findAll(): Promise<Emoticon[]> {
        const emoticon = 'emoticon';
        const queryBuilder = this.entityManager.createQueryBuilder(Emoticon, emoticon);
        return queryBuilder
            .orderBy(`${emoticon}.id`, 'DESC')
            .getMany();
    }
}
