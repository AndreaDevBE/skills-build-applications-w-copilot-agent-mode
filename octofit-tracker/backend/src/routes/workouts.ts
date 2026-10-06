import { Router } from 'express';
import Workout from '../models/Workout.js';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await Workout.find().sort({ name: 1 }).exec());
});

router.post('/', async (request, response) => {
  const workout = await Workout.create(request.body);
  response.status(201).json(workout);
});

router.get('/:id', async (request, response) => {
  const workout = await Workout.findById(request.params.id).exec();
  if (!workout) {
    response.status(404).json({ error: 'Workout not found' });
    return;
  }
  response.json(workout);
});

export default router;
