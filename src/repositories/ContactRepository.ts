import { Repository, EntityRepository } from 'typeorm';
import { Contact } from '../entities/Contact';
import { Service } from 'typedi';

@Service()
@EntityRepository(Contact)
export class ContactRepository extends Repository<Contact> {
    async createContact(newContact: Contact): Promise<Contact> {
        return await this.manager.save(newContact);
    }
}
