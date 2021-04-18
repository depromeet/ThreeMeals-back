import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Request } from 'express';
import { AccountService } from '../services/AccountService';
import { Account } from '../entities/account/Account';
import axios from 'axios';
// import { InsertAccountArgument } from './arguments/InsertAccountArgument';

@Service()
@Resolver(() => Account)
export class AccountResolver {
    constructor(
        private readonly accountService: AccountService, // private readonly commentService: CommentService,
    ) {}

    //   @Query(returns => User)
    //   async user(@Arg('id') id: number): Promise<User> {
    //     const user = await this.userService.getUser({ id });
    //     return user;
    //   }

    @Query((returns) => [Account])
    async users(@Ctx('req') req: Request): Promise<Account[]> {
        const users = await this.accountService.getAllUser();
        return users;
    }

    // FixMe N+1 쿼리 수정 필요 주의 !!!
    //   @FieldResolver()
    //   async comments(@Root() user: User): Promise<Comment[]> {
    //     const comments = await this.commentService.getAllCommentsByUserId(user.id);
    //     return comments;
    //   }

    @Mutation((returns) => Account)
    async createUser(@Args() { accessToken }: any, @Ctx() ctx: any): Promise<Account> {
        axios.post('');
    }
}
