import { Inject, Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import NotFoundException from '../exceptions/NotFoundException';
import { User } from '../entities/user/user.entity';
// import Comment from '../models/Comment';
import { logger } from '../logger/winston';
import * as faker from 'faker';
import { koreanMnemonic } from '../constants';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/userRepository';

@Service()
export class UserService {
  async createUser(args: { email: string; username: string }): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);
    let { username } = args;
    if (!username) {
      username = koreanMnemonic[faker.datatype.number(koreanMnemonic.length)];
      username += faker.datatype.number(100);
    }
    const userId = uuid().toString();
    const user = await userRepository.createAndSave(username, 'cesces333');
    return user;
  }

  async getAllUser(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  //   async getUser(args: { id: number }): Promise<User> {
  //     const { id: id } = args;
  //     const user = await User.findOne({
  //       where: { id: id },
  //       include: [
  //         {
  //           model: Comment,
  //           as: 'Comment',
  //           attributes: ['id', 'content'],
  //         },
  //       ],
  //     });

  //     if (!user) {
  //       logger.info('no user');
  //       throw new NotFoundException('no user');
  //     }

  //     return user;
  //   }
}
