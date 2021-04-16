import {Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from 'type-graphql';
import {Service} from 'typedi';
import {Request} from 'express';
import {UserService} from '../services/UserService';
import Account from '../models/Account';
import {InsertUserArgument} from './arguments/InsertUserArgument';
import {CommentService} from '../services/CommentService';
import Comment from '../models/Comment';

@Service()
@Resolver(() => Account)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly commentService: CommentService,
    ) {}

    @Query((returns) => Account)
    async user(
        @Arg('id') id: number,
    ): Promise<Account> {
        const Account = await this.userService.getUser({id});
        return Account;
    }

    @Query((returns) => [Account])
    async users(
        @Ctx('req') req: Request,
    ): Promise<Account[]> {
        const users = await this.userService.getAllUser();
        return users;
    }

    // FixMe N+1 쿼리 수정 필요 주의 !!!
    @FieldResolver()
    async comments(
        @Root() user: Account,
    ): Promise<Comment[]> {
        const comments = await this.commentService.getAllCommentsByUserId(user.id);
        return comments;
    }

    @Mutation((returns) => Account)
    async insertUser(
        @Args() {nickname, password}: InsertUserArgument,
        @Ctx() ctx: any,
    ): Promise<Account> {
        const user = await this.userService.createUser({nickname, password});
        return user;
    }
}
