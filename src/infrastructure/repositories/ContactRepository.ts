import { Contact } from '../../entities/Contact';
import { Service } from 'typedi';
import { BaseRepository } from '../type-orm/BaseRepository';

@Service()
export class ContactRepository extends BaseRepository<Contact> {
    async saveContact(newContact: Contact): Promise<Contact> {
        return await this.entityManager.save(newContact);
    }
}
