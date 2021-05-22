//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as logicSequenceCtrl from '../controllers/logic_sequence.controller';

//Get all logic sequences
router.get('/', logicSequenceCtrl.getLogicSequences);

//Add new activity
router.post('/', activityCtrl.createActivity);

//Update an activity
router.put('/:id', activityCtrl.updateActivityById);

//Delete an activity
router.delete('/:id', activityCtrl.deleteActivityById);
export default router;