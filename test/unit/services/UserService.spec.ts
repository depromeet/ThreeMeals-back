// import 'reflect-metadata';
// import * as faker from 'faker';
// import {UserService} from '../../../src/services/AccountService';
// import User from '../../../src/models/User';

// const createUser = (id: number): User => {
//     const user: any = {
//         id: id,
//         userId: 'aaa',
//         nickname: 'sample',
//         password: 'abc',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//     };
//     return user;
// };

// describe('UserService', () => {
//     let service: UserService;

//     beforeEach(() => {
//         service = new UserService();
//     });

//     describe('getUser', () => {
//         it('When user not found, then throw error', async () => {
//             // given
//             User.findOne = jest.fn().mockResolvedValue(null);

//             // when
//             // then
//             await expect(service.getUser({id: 100}))
//                 .rejects
//                 .toThrow();
//         });

//         it('When user found, then id & nickname & other parameter should be existed', async () => {
//             // given
//             const id = faker.datatype.number(100);
//             const user = createUser(id);
//             User.findOne = jest.fn().mockResolvedValue(user);

//             // when
//             const returnUser = await service.getUser({id});

//             // then
//             expect(returnUser.id).toBe(id);
//             expect(returnUser.nickname).toBe(user.nickname);
//         });
//     });
// });
