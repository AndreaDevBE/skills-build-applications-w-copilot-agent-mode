import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';
type SeedActivity = {
  user: mongoose.Types.ObjectId;
  type: 'running' | 'walking' | 'strength-training' | 'cycling' | 'swimming' | 'other';
  durationMinutes: number;
  calories: number;
  date: Date;
  notes: string;
};

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    const userRecords = [
      {
        username: 'alex.runner',
        email: 'alex.runner@example.com',
        name: 'Alex Rivera',
        bio: 'Enjoys early morning runs and weekend trail races.',
      },
      {
        username: 'jordan.moves',
        email: 'jordan.moves@example.com',
        name: 'Jordan Lee',
        bio: 'Strength training fan focused on steady progress.',
      },
      {
        username: 'sam.cycles',
        email: 'sam.cycles@example.com',
        name: 'Sam Patel',
        bio: 'Cyclist who likes exploring new routes with friends.',
      },
    ];

    const users = await Promise.all(
      userRecords.map(({ username, ...fields }) =>
        User.findOneAndUpdate({ username }, { $set: fields, $setOnInsert: { username } }, {
          returnDocument: 'after',
          upsert: true,
          runValidators: true,
        }).exec(),
      ),
    );

    const teamRecords = [
      {
        name: 'Trail Blazers',
        description: 'A team for runners, walkers, and outdoor explorers.',
        members: [users[0]._id, users[2]._id],
      },
      {
        name: 'Strength Squad',
        description: 'Building consistency and strength one session at a time.',
        members: [users[1]._id],
      },
    ];

    const teams = await Promise.all(
      teamRecords.map(({ name, ...fields }) =>
        Team.findOneAndUpdate({ name }, { $set: fields, $setOnInsert: { name } }, {
          returnDocument: 'after',
          upsert: true,
          runValidators: true,
        }).exec(),
      ),
    );

    const activities: SeedActivity[] = [
      {
        user: users[0]._id,
        type: 'running',
        durationMinutes: 35,
        calories: 320,
        date: new Date('2026-10-04T07:30:00.000Z'),
        notes: 'Steady neighborhood run',
      },
      {
        user: users[1]._id,
        type: 'strength-training',
        durationMinutes: 45,
        calories: 280,
        date: new Date('2026-10-04T16:00:00.000Z'),
        notes: 'Full-body strength session',
      },
      {
        user: users[2]._id,
        type: 'cycling',
        durationMinutes: 55,
        calories: 410,
        date: new Date('2026-10-05T08:00:00.000Z'),
        notes: 'Weekend bike path ride',
      },
    ];

    for (const activity of activities) {
      const existingActivity = await Activity.findOne()
        .where('user')
        .equals(activity.user)
        .where('type')
        .equals(activity.type)
        .where('date')
        .equals(activity.date)
        .exec();
      if (!existingActivity) {
        await Activity.create(activity);
      }
    }

    const leaderboardRecords = [
      { user: users[0]._id, team: teams[0]._id, points: 320 },
      { user: users[1]._id, team: teams[1]._id, points: 280 },
      { user: users[2]._id, team: teams[0]._id, points: 410 },
    ];

    await Promise.all(
      leaderboardRecords.map(({ user, ...fields }) =>
        Leaderboard.findOneAndUpdate(
          { user },
          { $set: fields, $setOnInsert: { user } },
          { returnDocument: 'after', upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    const workoutRecords = [
      {
        name: 'Easy 5K Builder',
        description: 'A comfortable-paced run with a short warm-up and cool-down.',
        category: 'running',
        difficulty: 'beginner',
        durationMinutes: 35,
      },
      {
        name: 'Bodyweight Basics',
        description: 'A balanced circuit of squats, push-ups, lunges, and planks.',
        category: 'strength-training',
        difficulty: 'beginner',
        durationMinutes: 30,
      },
      {
        name: 'Endurance Ride',
        description: 'A sustained cycling session at a conversational pace.',
        category: 'cycling',
        difficulty: 'intermediate',
        durationMinutes: 50,
      },
    ];

    await Promise.all(
      workoutRecords.map(({ name, ...fields }) =>
        Workout.findOneAndUpdate({ name }, { $set: fields, $setOnInsert: { name } }, {
          returnDocument: 'after',
          upsert: true,
          runValidators: true,
        }).exec(),
      ),
    );

    console.log('Database seeding complete: users, teams, activities, leaderboard, and workouts');
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error);
  process.exitCode = 1;
});
