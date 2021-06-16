//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as personCtrl from '../controllers/person.controller';
import { authJwt, verifyCreate } from '../middlewares';

//Obtener todos los usuarios dado un rol
router.get('/role/:role', [authJwt.verifyToken, authJwt.isAdminOrTeacher], personCtrl.getUserByRole);

//Obtener un usuario dado una id
router.get('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], personCtrl.getUserById);

//Crear un usuario
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher, verifyCreate.verifyFields, verifyCreate.checkRoleExisted], personCtrl.createUser);

//Actualizar un usuario por id
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], personCtrl.updateUserById);

//Actualizar la contraseña de un usuario por id
router.put('/session/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher, verifyCreate.verifySesionFields], personCtrl.updateUserPasswordById);

//Borrar un usuario por id
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], personCtrl.deleteUserById);

export default router;