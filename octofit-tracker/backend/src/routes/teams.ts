import { Router } from 'express';
import Team from '../models/Team.js';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await Team.find().populate('members', 'username name').sort({ name: 1 }).exec());
});

router.post('/', async (request, response) => {
  const team = await Team.create(request.body);
  response.status(201).json(await team.populate('members', 'username name'));
});

router.get('/:id', async (request, response) => {
  const team = await Team.findById(request.params.id).populate('members', 'username name').exec();
  if (!team) {
    response.status(404).json({ error: 'Team not found' });
    return;
  }
  response.json(team);
});

router.patch('/:id', async (request, response) => {
  const team = await Team.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  })
    .populate('members', 'username name')
    .exec();
  if (!team) {
    response.status(404).json({ error: 'Team not found' });
    return;
  }
  response.json(team);
});

export default router;
