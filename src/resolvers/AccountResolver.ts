import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Request } from 'express';
import { AccountService } from '../services/AccountService';
import { Account } from '../entities/account/Account';
import { Token } from '../schemas/TokenSchema';
import axios from 'axios';
import { logger } from '../logger/winston';
import { SignInArgument } from './arguments/SignInArgument';
import { token } from '../types/types';
@Service()
@Resolver(() => Account)
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}

    @Query((returns) => String)
    async helloWorld(): Promise<string> {
        return 'hello';
    }
    //   @Query(returns => User)
    //   async user(@Arg('id') id: number): Promise<User> {
    //     const user = await this.userService.getUser({ id });
    //     return user;
    //   }

    // @Query((returns) => [Account])
    // async users(@Ctx('req') req: Request): Promise<Account[]> {
    //     const users = await this.accountService.getAllUser();
    //     return users;
    // }

    // FixMe N+1 쿼리 수정 필요 주의 !!!
    //   @FieldResolver()
    //   async comments(@Root() user: User): Promise<Comment[]> {
    //     const comments = await this.commentService.getAllCommentsByUserId(user.id);
    //     return comments;
    //   }

    // jwtnewAccount
    @Mutation((returns) => Token)
    async signIn(@Args() { accessToken, provider }: SignInArgument, @Ctx() ctx: any): Promise<token> {
        const accountToken = await this.accountService.signIn({ accessToken, provider });
        return { token: accountToken };
    }
}
