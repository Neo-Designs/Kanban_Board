/**
 * Assigned to: Hiruka (Board Controller & Real-Time)
 * Description: Express router for board endpoints with JWT protection.
 */
import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  inviteCollaborator,
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All board routes are protected
router.use(protect);

router.route('/')
  .get(getBoards)
  .post(createBoard);

router.route('/:id')
  .get(getBoardById)
  .put(updateBoard)
  .delete(deleteBoard);

router.route('/:id/collaborators')
  .post(inviteCollaborator);

export default router;
