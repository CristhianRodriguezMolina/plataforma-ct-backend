//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as mazeCtrl from '../controllers/maze.controller';
import { authJwt } from '../middlewares';

//Get maze by activity id
router.get('/:id', [authJwt.verifyToken], mazeCtrl.getMazeByActivityId);

//Resize maze
router.put('/resize/:id', mazeCtrl.resizeMaze);

//Update maze
// router.put('/id', [authJwt.verifyToken, authJwt.isAdminOrTeacher], mazeCtrl.updateMazeByActivityId);

export default router;
