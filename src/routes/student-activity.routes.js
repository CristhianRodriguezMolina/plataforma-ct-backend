//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as studentActivityCtrl from '../controllers/student-activity.controller';
import { authJwt } from '../middlewares';

// Route for get all the student activity entities
router.get('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher], studentActivityCtrl.getAllStudentActivities);

// Route for get a student activity entity by its foreign ids
router.post('/foreign', [authJwt.verifyToken], studentActivityCtrl.getStudentActivityByForeignIds); // ITS A GET PETITION BUT IT NEEDS TO BE POST TO SEND THING THROUGHT THE BODY

// Route for get all the student activity entities
router.get('/:id', [authJwt.verifyToken], studentActivityCtrl.getStudentActivityById);

// Route for create a student activity entity
router.post('/', [authJwt.verifyToken], studentActivityCtrl.createStudentActivity);

// Route for update a student activity entity by its foreign ids
router.put('/:courseId/:taskId/:activityId/:studentId', [authJwt.verifyToken], studentActivityCtrl.updateStudentActivityByForeignIds);

// Route for update a student activity entity
router.put('/:id', [authJwt.verifyToken], studentActivityCtrl.updateStudentActivityById);

// Route for delete a student activity entity by its foreign ids
router.delete('/:courseId/:taskId/:activityId/:studentId', [authJwt.verifyToken], studentActivityCtrl.deleteStudentActivityByForeignIds);

// Route for delete a student activity entity
router.delete('/:id', [authJwt.verifyToken], studentActivityCtrl.deleteStudentActivityById);

export default router;