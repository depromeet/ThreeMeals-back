import { EntityRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { Service } from 'typedi';
import { PostState, PostType } from '../entities/Enums';
import { BaseRepository } from './BaseRepository';

@Service()
@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {
    async savePost(post: Post): Promise<Post> {
        const newPost = await this.entityManager.save(post);
        this.dbContext ? this.dbContext.addDomainEntity(newPost) : '';
        return newPost;
    }

    async countsGroupByPostType(args: {
        accountId: string,
        postState: PostState | null,
        postType: PostType | null,
    }): Promise<{postType: PostType, count: string}[]> {
        const { accountId, postType, postState } = args;
        const post = 'post';
        let builder = this.createQueryBuilder(post)
            .select(`${post}.post_type AS postType`)
            .addSelect(`COUNT(*) AS count`)
            .where(`${post}.to_account_id = :accountId`, { accountId });

        builder = postState ?
            builder.andWhere(`${post}.post_state = :postState`, { postState }) :
            builder;

        builder = postType ?
            builder.andWhere(`${post}.post_type = :postType`, { postType }) :
            builder;

        return builder
            .groupBy(`${post}.postType`)
            .getRawMany();
        // to Account id + postState(Submitted) + postType(nullable) 로 갯수를 가져온다.
    }

    async listByAccountId(args: {
        accountId: string,
        postType: PostType | null,
        postState: PostState | null,
        hasUsedEmoticons: boolean,
        limit: number,
        after: string | null
    }): Promise<Post[]> {
        const { accountId, hasUsedEmoticons, limit, after, postType, postState } = args;
        const post = 'post';
        const queryBuilder = this.createQueryBuilder(post);
        let builder = queryBuilder
            .leftJoinAndSelect(`${post}.fromAccount`, 'fromAccount')
            .leftJoinAndSelect(`${post}.toAccount`, 'toAccount');

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

        builder = postState ?
            builder.andWhere(`${post}.post_state = :postState`, { postState }) :
            builder;

        builder = postType ?
            builder.andWhere(`${post}.post_type = :postType`, { postType }) :
            builder;

        return builder
            .andWhere(`${post}.post_state != :postState`, { postState: PostState.Deleted })
            .orderBy(`${post}.id`, 'DESC')
            .limit(limit)
            .getMany();
    }

    async findOneById(postId: string, hasEmoticon = false): Promise<Post | undefined> {
        const post = 'post';
        let builder = this.createQueryBuilder(post)
            .leftJoinAndSelect(`${post}.fromAccount`, 'fromAccount')
            .leftJoinAndSelect(`${post}.toAccount`, 'toAccount')
        if (hasEmoticon) {
            builder = builder
                .leftJoinAndSelect(`${post}.usedEmoticons`, 'usedEmoticons')
                .leftJoinAndSelect(`usedEmoticons.emoticon`, 'emoticon');
        }
        return builder
            .where(`${post}.id = :postId`, { postId })
            .andWhere(`${post}.post_state != :postState`, { postState: PostState.Deleted })
            .getOne();
    }
}
