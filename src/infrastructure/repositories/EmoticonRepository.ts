import { Emoticon } from '../../entities/Emoticon';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';

@Service()
export class EmoticonRepository extends BaseRepository<Emoticon> {
    async findAll(): Promise<Emoticon[]> {
        return this.entityManager.find(Emoticon);
    }
}
