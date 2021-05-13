import {EntityRepository, Repository} from 'typeorm';
import {Post} from '../entities/Post';
import {Service} from 'typedi';
import {PostType} from '../entities/Enums';

@Service()
@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    async createPost(newPost: Post): Promise<Post> {
        return await this.manager.save(newPost);
    }

    async countNoComments() {

    }

    async listByAccountId(args: {
        accountId: string,
        postType: PostType | null,
        hasUsedEmoticons: boolean,
        limit: number,
        after: string | null
    }): Promise<Post[]> {
        const { accountId, hasUsedEmoticons, limit, after, postType } = args;
        const post = 'post';
        const queryBuilder = this.createQueryBuilder(post);
        let builder = queryBuilder;

        if (hasUsedEmoticons) {
            builder = builder
                .leftJoinAndSelect(`${post}.usedEmoticons`, 'usedEmoticons')
                .leftJoinAndSelect(`usedEmoticons.emoticon`, 'emoticon');
        }

        builder = builder
            .where(`${post}.to_account_id = :accountId`, { accountId });

        builder = after ?
            builder.andWhere(`${post}.id < :after`, { after }) :
            builder;

        builder = postType ?
            builder.andWhere(`${post}.post_type = :postType`, { postType }) :
            builder;

        return builder
            .orderBy(`${post}.id`, 'DESC')
            .limit(limit)
            .getMany();
    }

    async getPostById(postId: string): Promise<Post | undefined> {
        const post = 'post';
        return this.createQueryBuilder(post)
            .where(`${post}.id = :postId`, { postId })
            .getOne();
    }
}
