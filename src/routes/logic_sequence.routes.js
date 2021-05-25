//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as logicSequenceCtrl from '../controllers/logic_sequence.controller';

//Get all logic sequences
router.get('/', logicSequenceCtrl.getLogicSequences);

//Create a new sequence card by logic sequence id
router.post('/sequence_card/:id', logicSequenceCtrl.createSequenceCardByLogicSequenceId);

//Delete a sequence card by logic sequence id
router.delete('/sequence_card/:id/:sequence_card_id', logicSequenceCtrl.deleteSequenceCardByLogicSequenceId);

//Update a sequence card by logic sequence id
router.put('/sequence_card/:id/:sequence_card_id', logicSequenceCtrl.updateSequenceCardByLogicSequenceId);

//Get logic sequence by activity id
router.get('/:id', logicSequenceCtrl.getLogicSequenceIdByActivityId);

export default router;