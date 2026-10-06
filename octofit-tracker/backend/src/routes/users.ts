import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await User.find().sort({ username: 1 }).exec());
});

router.post('/', async (request, response) => {
  const user = await User.create(request.body);
  response.status(201).json(user);
});

router.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).exec();
  if (!user) {
    response.status(404).json({ error: 'User not found' });
    return;
  }
  response.json(user);
});

router.patch('/:id', async (request, response) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  }).exec();
  if (!user) {
    response.status(404).json({ error: 'User not found' });
    return;
  }
  response.json(user);
});

export default router;
