import { Arg, Args, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Contact } from '../entities/Contact';
import { ContactService } from '../services/ContactService';
import { Service } from 'typedi';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { Account } from '../entities/Account';
import { createContactArguments } from './arguments/ContactArgument';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';


@Service()
@Resolver(() => Contact)
export class ContactResolver {
    constructor(private readonly contactService: ContactService) {}

    @Mutation((returns) => Contact)
    @UseMiddleware(AuthMiddleware)
    async createContact(
        @Args() { content }: createContactArguments,
        @Ctx('account') account?: Account,
    ): Promise<Contact> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const contact = await this.contactService.createContact({
            content,
            sender: account,
        });
        return contact;
    }
}
