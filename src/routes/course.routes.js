//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as courseCtrl from '../controllers/course.controller';
import { authJwt } from '../middlewares';

// Route for get the courses of a student 
router.get('/mycourses/student/:id', [authJwt.verifyToken], courseCtrl.getMyStudentCourses);

// Route for get the courses of a teacher
router.get('/mycourses/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getMyCourses);

// Route for get the teacher of a course
router.get('/teacher/:id', [authJwt.verifyToken], courseCtrl.getTeacherCourse);

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

//Route for add actvitities to a task
router.post('/task/activity/:unitId/:taskId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.addActivitiesToTask);

// Route for Create a task
router.post('/task/:courseId/:unitId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.createTask);

//Route for add actvitities to a task
router.put('/task/activity/:taskId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.sortTaskActivities);

//Route for Update a task
router.put('/task/:courseId/:unitId/:taskId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateTask);

//Route for remove activities from task
router.delete('/task/activity/:taskId/:activityId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.removeActvitiesFromTask);

//Route for Delete a task
router.delete('/task/:courseId/:unitId/:taskId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.deleteTask);

//Route for get all activities in a course
router.get('/task/activity/:courseId', [authJwt.verifyToken], courseCtrl.getAllActivitiesInCourse);

//Route for get a task
router.get('/task/:courseId/:unitId/:taskId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getTask);

// Route for get the students in a specific course
router.get('/students/:id', [authJwt.verifyToken], courseCtrl.getStudents);

// Route for get the students in a specific course
router.get('/tasks/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getActivities);

// Route for get the students in a specific course
router.get('/not-in-course-students/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getStudentsNotInCourse);

// Route for get the activities in a specific task
router.get('/not-in-task-activities/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getActivitiesNotInTask);

// Route for update a course
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.updateCourseById);

// Route for add students to a course
router.post('/students/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.addStudentsByCourseId);

// Route for remove students from course
router.delete('/students/:courseId/:studentId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.removeStudentsByCourseId);

// Get student individual progress 
router.get('/students/individual-progress/:studentId/:courseId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], courseCtrl.getStudentIndividualProgress);

// Route for get the last activity to continue the latest task
router.get('/students/last-activity/:studentId/:courseId/:unitId', [authJwt.verifyToken], courseCtrl.getLastActivityToContinue);

export default router;
