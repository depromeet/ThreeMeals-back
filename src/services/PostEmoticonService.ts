import { Inject, Service } from 'typedi';
import { PostEmoticon } from '../entities/PostEmoticon';
import { PostRepository } from '../repositories/PostRepository';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { logger } from 'src/logger/winston';

@Service()
export class PostEmoticonService {
    constructor(
        @InjectRepository() private readonly postEmoticonRepository: PostEmoticonRepository,
        @InjectRepository() private readonly postRepository: PostRepository,
    ) {}

    async findPostEmoticon(postId: string): Promise<PostEmoticon[]> {
        const postEmoticon = await this.postEmoticonRepository.listPostEmoticonByPostId(postId);
        return postEmoticon;
    }
}
