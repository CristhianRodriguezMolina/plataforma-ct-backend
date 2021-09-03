//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as perspectiveCtrl from '../controllers/perspective.controller';
import { authJwt } from '../middlewares';

//Get perspective by person mongoose id
router.get('/:person/:personId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], perspectiveCtrl.getPerspectiveByPersonId);

//Update perspective by perspective id
router.put('/:perspectiveId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], perspectiveCtrl.updatePerspectiveByPerspectiveId);

//Delete perspective by perspective id
router.delete('/:perspectiveId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], perspectiveCtrl.deletePerspectiveByPerspectiveId);

//Create perspective
router.post('/:courseId/:teacherId/:studentId', [authJwt.verifyToken, authJwt.isAdminOrTeacher], perspectiveCtrl.createPerspective);

export default router;
