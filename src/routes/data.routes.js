//NPM modules imports
import { Router } from 'express';

//API modules imports
import * as dataCtrl from '../controllers/data.controller';
import { upload, authJwt } from '../middlewares';

//Router declaration
const router = Router();

//Route to upload an image from a logic sequence
router.post('/upload-img/:logic_sequence_id/:sequence_card_id', [authJwt.verifyToken, authJwt.isAdminOrTeacher, upload.uploadImg], dataCtrl.uploadImg);

//Route to upload an image from a course
router.post('/upload-img-course/:courseId', [authJwt.verifyToken, authJwt.isAdminOrTeacher, upload.uploadImg], dataCtrl.uploadCourseImg);

//Route to upload an image from a profile
router.post('/upload-profile-img-user/:userId', [authJwt.verifyToken, authJwt.isAdminOrTeacher, upload.uploadImg], dataCtrl.uploadProfileUserImg);

//Route to upload an image from a questionnaire question
router.post('/upload-questionnaire-img/question/:questionnaireId/:questionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher, upload.uploadImg], dataCtrl.uploadQuestionImg);

//Route to upload an image from a questionnaire option
router.post('/upload-questionnaire-img/option/:questionnaireId/:questionId/:optionId', [authJwt.verifyToken, authJwt.isAdminOrTeacher, upload.uploadImg], dataCtrl.uploadOptionImg);

export default router;
