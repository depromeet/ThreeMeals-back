import {Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from 'type-graphql';
import {Service} from 'typedi';
import {Request} from 'express';
import {UserService} from '../services/UserService';
import User from '../models/User';
import {InsertUserArgument} from './arguments/InsertUserArgument';
import {CommentService} from '../services/CommentService';
import Comment from '../models/Comment';

@Service()
@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly commentService: CommentService,
    ) {}

    @Query((returns) => User)
    async user(
        @Arg('id') id: number,
    ): Promise<User> {
        const user = await this.userService.getUser({id});
        return user;
    }

    @Query((returns) => [User])
    async users(
        @Ctx('req') req: Request,
    ): Promise<User[]> {
        const users = await this.userService.getAllUser();
        return users;
    }

    // FixMe N+1 쿼리 수정 필요 주의 !!!
    @FieldResolver()
    async comments(
        @Root() user: User,
    ): Promise<Comment[]> {
        const comments = await this.commentService.getAllCommentsByUserId(user.id);
        return comments;
    }

    @Mutation((returns) => User)
    async insertUser(
        @Args() {nickname, password}: InsertUserArgument,
        @Ctx() ctx: any,
    ): Promise<User> {
        const user = await this.userService.createUser({nickname, password});
        return user;
    }
}
