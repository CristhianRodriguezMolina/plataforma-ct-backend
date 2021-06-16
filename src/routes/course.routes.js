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

// Route for delete a course
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.deleteCourse);

// Route for create a unit
router.post('/unit/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.createUnit);

// Route for delete a unit course
router.delete('/unit/:courseId/:unitId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.deleteUnit);

// Route for update a unit course
router.put('/unit/:courseId/:unitId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateUnit);

// Route for Create a task
router.post('/task/:courseId/:unitId', courseCtrl.createTask);

//Route for Update a task
router.put('/task/:courseId/:unitId/:taskId', courseCtrl.updateTask);

//Route for add actvitities to a task
router.post('/task/activity/:courseId/:unitId/:taskId', courseCtrl.addActivitiesToTask);

//Route for remove activities from task
router.delete('/task/activity/:taskId/:activityId', courseCtrl.removeActvitiesFromTask);

//Route for Delete a task
router.delete('/task/:courseId/:unitId/:taskId', courseCtrl.deleteTask);

// Route for get the students in a specific course
router.get('/students/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getStudents);

// Route for get the students in a specific course
router.get('/not-in-course-students/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getStudentsNotInCourse);

// Route for update a course
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateCourseById);

// Route for add students to a course
router.post('/students/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.addStudentsByCourseId);

// Route for remove students from course
router.delete('/students/:courseId/:studentId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.removeStudentsByCourseId);

export default router;