//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as courseCtrl from '../controllers/course.controller';
import { authJwt } from '../middlewares';

// Route for get the courses of a teacher
router.get('/mycourses/:id', [authJwt.verifyToken], courseCtrl.getMyCourses);

// Route for get a course by id
router.get('/:id', [authJwt.verifyToken], courseCtrl.getCoursesById);

// Route for create a course
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.createCourse);

// Route for delete a course
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.deleteCourse);

// Route for update a course
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateCourseById);

export default router;