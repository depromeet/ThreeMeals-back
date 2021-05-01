/* eslint-disable camelcase */
import { Inject, Service } from 'typedi';
import { Emoticon } from '../entities/Emoticon';
import { PostEmoticon } from '../entities/PostEmoticon';
import { EmoticonRepository } from '../repositories/EmoticonRepository';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { logger } from 'src/logger/winston';

@Service()
export class EmoticonService {
    constructor(
        @InjectRepository() private readonly EmoticonRepository: EmoticonRepository,
        @InjectRepository() private readonly PostEmoticonRepository: PostEmoticonRepository,
    ) {}

    async getAllEmoticons(): Promise<Emoticon[]> {
        const emoticons = await this.EmoticonRepository.find();
        return emoticons;
    }

    async findEmoticon(id: number): Promise<Emoticon[]> {
        const Emoticons = await this.EmoticonRepository.find({ where: { id: id } });
        return Emoticons;
    }

    // async findEmoticonResolver(id: number): Promise<Emoticon[]> {
    //     // const from = await this.PostEmoticonRepository.getPostEmoticonId(id);
    //     const Emoticons = await this.EmoticonRepository.find({ id: id });
    //     return Emoticons;
    // }

    async findEmoticonResolver(id: number): Promise<Emoticon[]> {
        // const from = await this.PostEmoticonRepository.getPostEmoticonId(id);
        const Emoticons = await this.EmoticonRepository.find({ where: { id: id } });
        return Emoticons;
    }
}
