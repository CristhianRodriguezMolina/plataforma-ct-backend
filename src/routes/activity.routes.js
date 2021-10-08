//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as activityCtrl from '../controllers/activity.controller';
import { authJwt } from '../middlewares';

//Get all activities
router.get('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher], activityCtrl.getActivities);

//Add new activity
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher], activityCtrl.createActivity);

//Update an activity
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], activityCtrl.updateActivityById);

//Delete an activity
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], activityCtrl.deleteActivityById);

// Route for get the activities by teacher
router.get('/myactivities/:creatorId', [authJwt.verifyToken], activityCtrl.getMyActivities);

// Get an activity by id
router.get('/:id', [authJwt.verifyToken], activityCtrl.getActivityById)

export default router;
