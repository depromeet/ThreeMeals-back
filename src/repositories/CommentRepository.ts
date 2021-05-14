import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { Comment } from '../entities/Comment';

@Service()
@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    async createComment(newComment: Comment): Promise<Comment> {
        return await this.manager.save(newComment);
    }

    async findOneByPostId(postId: string): Promise<Comment | undefined> {
        return this.findOne({ postId }, { relations: ['account'] });
    }

    async listParentByPostId(args: {
        postId: string,
        limit: number,
        after: string | null
    }): Promise<Comment[]> {
        const { postId, limit, after } = args;
        const comment = 'comment';
        const queryBuilder = this.createQueryBuilder(comment);
        let builder = queryBuilder
            .leftJoinAndSelect(`${comment}.account`, 'account')
            .where(`${comment}.post_id = :postId`, { postId })
            .andWhere(`${comment}.parent_id IS NULL`);

        // comment 는 오래된 순
        builder = after ?
            builder.andWhere(`${comment}.id > :after`, { after }) :
            builder;

        return builder
            .orderBy(`${comment}.id`, 'ASC')
            .limit(limit)
            .getMany();
    }

    async listChildrenByParentIdAndPostId(args: {
        parentId: string,
        postId: string,
        limit: number,
        after: string | null
    }): Promise<Comment[]> {
        const { parentId, postId, limit, after } = args;
        const comment = 'comment';
        let builder = this.createQueryBuilder(comment)
            .leftJoinAndSelect(`${comment}.account`, 'account')
            .where(`${comment}.parent_id = :parentId`, { parentId })
            .andWhere(`${comment}.post_id = :postId`, { postId });

        // comment 는 오래된 순
        builder = after ?
            builder.andWhere(`${comment}.id > :after`, { after }) :
            builder;

        return builder
            .orderBy(`${comment}.id`, 'ASC')
            .limit(limit)
            .getMany();
    }

    async listByPostIds(postIds: string[]): Promise<Comment[]> {
        const comment = 'comment';
        const queryBuilder = this.createQueryBuilder(comment);
        return queryBuilder
            .leftJoinAndSelect(`${comment}.account`, 'account')
            .where(`${comment}.post_id IN (:...postIds)`, { postIds })
            .getMany();
    }

    async deleteOneById(commentId: string): Promise<DeleteResult> {
        const result = await this.delete({ id: commentId });
        return result;
    }

    async findOneById(commentId: string): Promise<Comment | undefined> {
        return this.findOne({ id: commentId }, { relations: ['account'] });
    }

    async getChildrenCountCommentsByIds(commentIds: string[]): Promise<{parentId: string, childrenCount: string}[]> {
        const comment = 'comment';
        return this.createQueryBuilder(comment)
            .select(`${comment}.parent_id AS parentId`)
            .addSelect(`COUNT(*) AS childrenCount`)
            .where(`${comment}.parent_id IN (:...commentIds)`, { commentIds })
            .groupBy('comment.parent_id')
            .getRawMany();
    }
}
