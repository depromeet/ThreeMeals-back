import {RequestHandler} from 'express';
import {Container} from 'typedi';
import {UserService} from '../../services/UserService';


export const find: RequestHandler = async (req, res, next) => {
    try {
        const userService = Container.get(UserService);
        // const userService = new UserService();
        console.log(userService);
        const getUserArgs = {id: parseInt(req.params.id, 10)};
        const userInfo = await userService.getUser(getUserArgs);
        res.json({
            userInfo,
        });
    } catch (err) {
        next(err);
    }
};

