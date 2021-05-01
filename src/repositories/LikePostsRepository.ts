import { Repository, EntityRepository } from 'typeorm';
import { LikePosts } from '../entities/LikePosts';
import { Service } from 'typedi';


@Service()
@EntityRepository(LikePosts)
export class LikePostsRepository extends Repository<LikePosts> {

}
