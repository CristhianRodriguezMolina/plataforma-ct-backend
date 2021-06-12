//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as logicSequenceCtrl from '../controllers/logic-sequence.controller';
import { authJwt } from '../middlewares';

//Get all logic sequences
router.get('/', [authJwt.verifyToken, authJwt.isAdminOrTeacher], logicSequenceCtrl.getLogicSequences);

//Create a new sequence card by logic sequence id
router.post('/sequence-card/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], logicSequenceCtrl.createSequenceCardByLogicSequenceId);

//Delete a sequence card by logic sequence id
router.delete('/sequence-card/:id/:sequence_card_id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], logicSequenceCtrl.deleteSequenceCardByLogicSequenceId);

//Update a sequence card by logic sequence id
router.put('/sequence-card/:id/:sequence_card_id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], logicSequenceCtrl.updateSequenceCardByLogicSequenceId);


//Get logic sequence by activity id
router.get('/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], logicSequenceCtrl.getLogicSequenceIdByActivityId);

export default router;