import {Inject, Service} from 'typedi';
import {v4 as uuid} from 'uuid';
import NotFoundException from '../exceptions/NotFoundException';
import Account from '../models/Account';
import Comment from '../models/Comment';
import {logger} from '../logger/winston';
import * as faker from 'faker';
import {koreanMnemonic} from '../constants';

@Service()
export class UserService {
    async createUser(args: {
        nickname?: string,
        password: string
    }): Promise<Account> {
        let {nickname, password} = args;
        if (!nickname) {
            nickname = koreanMnemonic[faker.datatype.number(koreanMnemonic.length)];
            nickname += faker.datatype.number(100);
        }
        const userId = uuid().toString();
        const user = await Account.create({
            nickname,
            password,
            userId,
        });
        return user;
    }

    async getAllUser(): Promise<Account[]> {
        const users = await Account.findAll();
        return users;
    }

    async getUser(args: { id: number }): Promise<Account> {
        const {id: id} = args;
        const user = await Account.findOne({
            where: {id: id},
            include: [{
                model: Comment,
                as: 'Comment',
                attributes: ['id', 'content'],
            }],
        });

        if (!user) {
            logger.info('no user');
            throw new NotFoundException('no user');
        }

        return user;
    }
}
