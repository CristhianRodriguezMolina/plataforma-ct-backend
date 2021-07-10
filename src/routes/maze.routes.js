//NPM modules imports
import { Router } from 'express';
const router = Router();

//API modules imports
import * as mazeCtrl from '../controllers/maze.controller';
import { authJwt } from '../middlewares';

//Get maze by activity id
router.get('/:id', [authJwt.verifyToken], mazeCtrl.getMazeByActivityId);

export default router;