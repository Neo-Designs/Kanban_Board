import express from 'express';
import { updateProfile, getProfileStats } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.get('/stats', getProfileStats);

export default router;
