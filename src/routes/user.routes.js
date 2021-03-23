//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as userCtrl from '../controllers/user.controller';

//Obtener todos los usuarios
router.get('/', userCtrl.getUsers);

export default router;