//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as questionnaireCtrl from '../controllers/questionnaire.controller';
import { authJwt } from '../middlewares';

//Get maze by activity id
router.get('/:id', [authJwt.verifyToken], questionnaireCtrl.getQuestionnaireByActivityId);

// METHODS FOR QUESTIONS --------------------------------------------------------------------------------------

// Create a question in a questionnaire by id
router.post('/question/:id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], questionnaireCtrl.createQuestionByQuestionnaireId);

// Delete a question in a questionnaire by id
router.delete('/question/:id/:questionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], questionnaireCtrl.deleteQuestionByQuestionnaireId);

// Update a question in a questionnaire by id
router.put('/question/:id/:questionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], questionnaireCtrl.updateQuestionByQuestionnaireId);

// METHODS FOR OPTIONS --------------------------------------------------------------------------------------

// Create a option in a questionnaire question by ids
router.post('/option/:id/:questionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], questionnaireCtrl.createOptionByQuestionnaireAndQuestionId);

// Delete a option in a questionnaire question by ids
router.delete('/option/:id/:questionId/:optionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], questionnaireCtrl.deleteOptionByQuestionnaireAndQuestionId);

// Update a option in a questionnaire question by ids
router.put('/option/:id/:questionId/:optionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], questionnaireCtrl.updateOptionByQuestionnaireAndQuestionId);

export default router;
