import { Router } from 'express';
import Leaderboard from '../models/Leaderboard.js';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(
    await Leaderboard.find()
      .populate('user', 'username name')
      .populate('team', 'name')
      .sort({ points: -1, updatedAt: 1 })
      .exec(),
  );
});

export default router;
