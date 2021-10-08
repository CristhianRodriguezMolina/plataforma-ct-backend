//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as personCtrl from '../controllers/person.controller';
import { authJwt, verifyCreate } from '../middlewares';

//Obtener todos los usuarios dado un rol
router.get('/role/:role', [authJwt.verifyToken, authJwt.isAdminOrTeacher], personCtrl.getUserByRole);

//Obtener un usuario dado una id
router.get('/:id', [authJwt.verifyToken], personCtrl.getUserById);

//Obtener un usuario dado una identificación
router.get('/identification/:id', [authJwt.verifyToken], personCtrl.getUserByIdentification);

//Crear un usuario
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher, verifyCreate.verifyFields, verifyCreate.checkRoleExisted], personCtrl.createUser);

//Actualizar un usuario por id
router.put('/:id', [authJwt.verifyToken], personCtrl.updateUserById);

//Actualizar la contraseña de un usuario por id
router.put('/session/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher, verifyCreate.verifySesionFields], personCtrl.updateUserPasswordById);

//Actualizar la contraseña de un usuario por id y su contraseña actual
router.put('/change-password/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher, verifyCreate.verifySesionFields], personCtrl.updateUserPasswordByIdAndCurrentPassword);

//Borrar un usuario por id
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], personCtrl.deleteUserById);

export default router;