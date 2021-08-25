import { Service } from 'typedi';
import { BaseRepository } from '../type-orm/BaseRepository';
import { LikeComment } from '../../entities/LikeComment';
import { Comment } from '../../entities/Comment';

@Service()
export class LikeCommentRepository extends BaseRepository<LikeComment> {
    async addLike(likeComment: LikeComment): Promise<LikeComment> {
        return this.entityManager.save(likeComment);
    }

    async deleteLikes(comment: Comment): Promise<void> {
        await this.entityManager.delete(LikeComment, {
            comment: comment,
        });
    }
}
