//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as personCtrl from '../controllers/person.controller';
import { authJwt, verifyCreate } from '../middlewares';

//Obtener todos los usuarios dado un rol
router.get('/role/:role', personCtrl.getUserByRole);

//Obtener un usuario dado una id
router.get('/:id', personCtrl.getUserById);

//Crear un usuario
router.post('/', [verifyCreate.verifyFields, verifyCreate.checkRoleExisted], personCtrl.createUser);

//Actualizar un usuario por id
router.put('/:id', personCtrl.updateUserById);

//Borrar un usuario por id
router.delete('/:id', personCtrl.deleteUserById);

export default router;