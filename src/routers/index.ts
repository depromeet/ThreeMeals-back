// 혹시 몰라서 restapi 예제 폴더입니다.

import * as express from 'express';
import users from './users';

const router = express.Router();

router.use('/find', users);

export default router;
