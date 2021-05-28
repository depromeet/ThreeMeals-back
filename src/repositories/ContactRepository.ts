import { Repository, EntityRepository } from 'typeorm';
import { Contact } from '../entities/Contact';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';

@Service()
@EntityRepository(Contact)
export class ContactRepository extends BaseRepository<Contact> {
    async saveContact(newContact: Contact): Promise<Contact> {
        return await this.entityManager.save(newContact);
    }
}
