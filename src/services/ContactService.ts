import { Inject, Service } from 'typedi';
import { Contact } from '../entities/Contact';
import { AccountRepository } from '../repositories/AccountRepository';
import { ContactRepository } from '../repositories/ContactRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { createContactArguments } from '../resolvers/arguments/ContactArgument';
import { logger } from 'src/logger/winston';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Account } from '../entities/Account';

@Service()
export class ContactService {
    constructor(
        @InjectRepository()
        private readonly accountRepository: AccountRepository,

        @InjectRepository()
        private readonly ContactRepository: ContactRepository) {}
    async createContact(args: {
        sender: Account,
        content: string,
    }): Promise<Contact> {
        const { sender, content } = args;

        const account = await this.accountRepository.getAccountId(sender.id);
        if (!account) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        const newContact = new Contact();

        newContact.sender = sender;
        newContact.content = content;

        console.log(newContact);
        await this.ContactRepository.createContact(newContact);

        return newContact;
    }
}
