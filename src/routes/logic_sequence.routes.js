//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as logicSequenceCtrl from '../controllers/logic_sequence.controller';

//Get all logic sequences
router.get('/', logicSequenceCtrl.getLogicSequences);

//Add new activity
router.post('/', logicSequenceCtrl.createLogicSequence);

//Update an activity
router.put('/:id', logicSequenceCtrl.updateLogicSequenceById);

//Delete an activity
router.delete('/:id', logicSequenceCtrl.deleteLogicSequenceById);
export default router;