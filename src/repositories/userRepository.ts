import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { Service } from 'typedi';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    // createUser() {
    //   return this.createQueryBuilder('user').insert('');
    // }
    // findByName(username: string) {
    //   return this.createQueryBuilder('user')
    //     .where('user.firstName = :firstName', { firstName })
    //     .andWhere('user.lastName = :lastName', { lastName })
    //     .getMany();
    // }
    async createAndSave(username: string, email: string) {
        const user = new User();
        user.username = username;
        user.email = email;
        return this.manager.save(user);
    }
    //   findByName(firstName: string, lastName: string) {
    //     return this.createQueryBuilder('user')
    //       .where('user.firstName = :firstName', { firstName })
    //       .andWhere('user.lastName = :lastName', { lastName })
    //       .getMany();
    //   }
}
