//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as courseCtrl from '../controllers/course.controller';
//import { authJwt } from '../middlewares'

// Route for get the courses of a teacher
router.get('/', courseCtrl.getMyCourses);

// Route for create a course
router.post('/', courseCtrl.createCourse);

// Route for delete a course
router.delete('/', courseCtrl.deleteCourse);

// Route for update a course
router.put('/', courseCtrl.updateCourse);

export default router;