import { Router } from 'express';
import Activity from '../models/Activity.js';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(
    await Activity.find().populate('user', 'username name').sort({ date: -1 }).exec(),
  );
});

router.post('/', async (request, response) => {
  const activity = await Activity.create(request.body);
  response.status(201).json(await activity.populate('user', 'username name'));
});

router.get('/:id', async (request, response) => {
  const activity = await Activity.findById(request.params.id)
    .populate('user', 'username name')
    .exec();
  if (!activity) {
    response.status(404).json({ error: 'Activity not found' });
    return;
  }
  response.json(activity);
});

export default router;
