//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as authCtrl from '../controllers/auth.controller';
import { authJwt } from '../middlewares';

//Signin 
router.post('/signin', authCtrl.signin);

//Refresh token
router.post('/refresh_token', authCtrl.verifyRefreshToken);

export default router;