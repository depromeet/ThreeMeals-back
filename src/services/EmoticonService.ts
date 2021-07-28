import { Service } from 'typedi';
import { Emoticon } from '../entities/Emoticon';
import { EmoticonRepository } from '../infrastructure/repositories/EmoticonRepository';

@Service()
export class EmoticonService {
    constructor(
        private readonly emoticonRepository: EmoticonRepository,
    ) {}

    async getAllEmoticons(): Promise<Emoticon[]> {
        const emoticons = await this.emoticonRepository.findAll();
        return emoticons;
    }
}
