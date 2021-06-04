//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as authCtrl from '../controllers/auth.controller';

//Signin 
router.post('/signin', authCtrl.signin);

export default router;