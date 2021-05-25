//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as activityCtrl from '../controllers/activity.controller';

//Get all activities
router.get('/', activityCtrl.getActivities);

//Add new activity
router.post('/', activityCtrl.createActivity);

//Update an activity
router.put('/:id', activityCtrl.updateActivityById);

//Delete an activity
router.delete('/:id', activityCtrl.deleteActivityById);

// Get an activity by id
// router.get('/:id', activityCtrl.getActivityById)

export default router;