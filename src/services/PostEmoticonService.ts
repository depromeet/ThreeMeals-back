/* eslint-disable camelcase */
import { Inject, Service } from 'typedi';
import { PostEmoticon } from '../entities/PostEmoticon';
import { PostRepository } from '../repositories/PostRepository';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from 'src/logger/winston';

@Service()
export class PostEmoticonService {
    constructor(
        @InjectRepository() private readonly PostEmoticonRepository: PostEmoticonRepository,
        @InjectRepository() private readonly PostRepository: PostRepository,
    ) {}

    async findPostEmoticon(id: number): Promise<PostEmoticon[]> {
        const from = await this.PostRepository.getPostId(id);
        const PostEmoticon = await this.PostEmoticonRepository.find({ where: { post: from },
        });
        return PostEmoticon;
    }
}
