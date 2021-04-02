import {RequestHandler} from 'express';
import {userService} from '../../service';


export const find: RequestHandler = async (req, res, next) => {
  try {
      const getUserArgs = {id: parseInt(req.params.id, 10)};
      const userInfo = await userService.getUser(getUserArgs);
      res.json({
        userInfo,
      });
  } catch (err) {
      next(err);
  }
};

