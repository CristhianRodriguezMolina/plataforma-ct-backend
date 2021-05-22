//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as logicSequenceCtrl from '../controllers/logic_sequence.controller';

//Get all logic sequences
router.get('/', logicSequenceCtrl.getLogicSequences);

export default router;