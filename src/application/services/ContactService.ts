import { Service } from 'typedi';
import { Contact } from '../../entities/Contact';
import { AccountRepository } from '../../infrastructure/repositories/AccountRepository';
import { ContactRepository } from '../../infrastructure/repositories/ContactRepository';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';

@Service()
export class ContactService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly ContactRepository: ContactRepository,
    ) {}

    async createContact(args: {
        sender: AccountOrmEntity,
        content: string,
    }): Promise<Contact> {
        const { sender, content } = args;

        const account = await this.accountRepository.findOneById(sender.id);
        if (!account) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        const newContact = new Contact();

        newContact.sender = sender;
        newContact.content = content;

        console.log(newContact);
        await this.ContactRepository.saveContact(newContact);

        return newContact;
    }
}
