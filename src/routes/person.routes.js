//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as personCtrl from '../controllers/person.controller';
import { authJwt, verifyCreate } from '../middlewares';

//Obtener todos los usuarios dado un rol
router.get('/role/:role', [authJwt.verifyToken], personCtrl.getUserByRole);

//Obtener un usuario dado una id
router.get('/:id', [authJwt.verifyToken], personCtrl.getUserById);

//Crear un usuario
router.post('/', [authJwt.verifyToken, verifyCreate.verifyFields, verifyCreate.checkRoleExisted], personCtrl.createUser);

//Actualizar un usuario por id
router.put('/:id', [authJwt.verifyToken], personCtrl.updateUserById);

//Borrar un usuario por id
router.delete('/:id', [authJwt.verifyToken], personCtrl.deleteUserById);

export default router;