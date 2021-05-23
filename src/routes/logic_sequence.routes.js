//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as logicSequenceCtrl from '../controllers/logic_sequence.controller';

//Get all logic sequences
router.get('/', logicSequenceCtrl.getLogicSequences);

//Update a logic sequence
router.put('/:id', logicSequenceCtrl.updateLogicSequenceById);

//Delete a logic sequence
router.delete('/:id', logicSequenceCtrl.deleteLogicSequenceById);
export default router;