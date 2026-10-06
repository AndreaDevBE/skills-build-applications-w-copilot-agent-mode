import express from 'express';
import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import activitiesRouter from './routes/activities.js';
import leaderboardRouter from './routes/leaderboard.js';
import teamsRouter from './routes/teams.js';
import usersRouter from './routes/users.js';
import workoutsRouter from './routes/workouts.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api', apiBaseUrl });
});

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API endpoint not found' });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    response.status(409).json({ error: 'A record with that unique value already exists' });
    return;
  }

  if (typeof error === 'object' && error !== null && 'status' in error && error.status === 400) {
    response.status(400).json({ error: 'Invalid JSON request body' });
    return;
  }

  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`OctoFit Tracker API listening on ${apiBaseUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start OctoFit Tracker API:', error);
  process.exit(1);
});
