//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as courseCtrl from '../controllers/course.controller';
import { authJwt } from '../middlewares';

// Route for get the courses of a teacher
router.get('/mycourses/:id', [authJwt.verifyToken], courseCtrl.getMyCourses);

// Route for get a course by id
router.get('/:id', [authJwt.verifyToken], courseCtrl.getCourseById);

// Route for create a course
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.createCourse);

// Route for create a unit
router.post('/unit/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.createUnit);

// Route for delete a course
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.deleteCourse);

// Route for delete a unit course
router.delete('/unit/:courseId/:unitId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.deleteUnit);

// Route for update a unit course
router.put('/unit/:courseId/:unitId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateUnit);

// Route for update a course
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateCourseById);

// Route for update a course
router.put('/add-students/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.addStudents);

export default router;