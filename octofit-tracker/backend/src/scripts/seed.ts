import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';
type SeedActivity = {
  username: string;
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
      {
        username: 'taylor.trails',
        email: 'taylor.trails@example.com',
        name: 'Taylor Brooks',
        bio: 'Enjoys long walks, local trails, and an occasional swim.',
      },
      {
        username: 'morgan.lifts',
        email: 'morgan.lifts@example.com',
        name: 'Morgan Chen',
        bio: 'Working toward a balanced routine with strength and cycling.',
      },
      {
        username: 'casey.active',
        email: 'casey.active@example.com',
        name: 'Casey Johnson',
        bio: 'Likes mixing short runs with relaxed weekend walks.',
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
    const userByUsername = new Map(users.map((user) => [user.username, user]));
    const getUser = (username: string) => {
      const user = userByUsername.get(username);
      if (!user) {
        throw new Error(`Seed user not found: ${username}`);
      }
      return user;
    };

    const teamRecords = [
      {
        name: 'Trail Blazers',
        description: 'A team for runners, walkers, and outdoor explorers.',
        members: [getUser('alex.runner')._id, getUser('casey.active')._id],
      },
      {
        name: 'Strength Squad',
        description: 'Building consistency and strength one session at a time.',
        members: [getUser('jordan.moves')._id, getUser('morgan.lifts')._id],
      },
      {
        name: 'Weekend Movers',
        description: 'Making room for fun rides, walks, and active weekends.',
        members: [getUser('sam.cycles')._id, getUser('taylor.trails')._id],
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
    const teamByName = new Map(teams.map((team) => [team.name, team]));
    const getTeam = (name: string) => {
      const team = teamByName.get(name);
      if (!team) {
        throw new Error(`Seed team not found: ${name}`);
      }
      return team;
    };

    const activities: SeedActivity[] = [
      {
        username: 'alex.runner',
        type: 'running',
        durationMinutes: 35,
        calories: 320,
        date: new Date('2026-10-04T07:30:00.000Z'),
        notes: 'Comfortable neighborhood loop',
      },
      {
        username: 'jordan.moves',
        type: 'strength-training',
        durationMinutes: 45,
        calories: 280,
        date: new Date('2026-10-04T16:00:00.000Z'),
        notes: 'Full-body strength session with a warm-up',
      },
      {
        username: 'sam.cycles',
        type: 'cycling',
        durationMinutes: 55,
        calories: 410,
        date: new Date('2026-10-05T08:00:00.000Z'),
        notes: 'Weekend bike path ride',
      },
      {
        username: 'alex.runner',
        type: 'running',
        durationMinutes: 30,
        calories: 275,
        date: new Date('2026-09-30T07:15:00.000Z'),
        notes: 'Easy midweek recovery run',
      },
      {
        username: 'alex.runner',
        type: 'strength-training',
        durationMinutes: 25,
        calories: 160,
        date: new Date('2026-09-26T17:00:00.000Z'),
        notes: 'Short mobility and core session',
      },
      {
        username: 'jordan.moves',
        type: 'walking',
        durationMinutes: 35,
        calories: 145,
        date: new Date('2026-10-01T12:15:00.000Z'),
        notes: 'Brisk lunchtime walk',
      },
      {
        username: 'jordan.moves',
        type: 'strength-training',
        durationMinutes: 40,
        calories: 255,
        date: new Date('2026-09-27T16:30:00.000Z'),
        notes: 'Upper-body strength workout',
      },
      {
        username: 'sam.cycles',
        type: 'cycling',
        durationMinutes: 40,
        calories: 300,
        date: new Date('2026-10-01T08:00:00.000Z'),
        notes: 'Easy commute and extra loop',
      },
      {
        username: 'sam.cycles',
        type: 'running',
        durationMinutes: 30,
        calories: 270,
        date: new Date('2026-09-27T09:00:00.000Z'),
        notes: 'Short riverside run',
      },
      {
        username: 'taylor.trails',
        type: 'walking',
        durationMinutes: 45,
        calories: 190,
        date: new Date('2026-10-05T09:00:00.000Z'),
        notes: 'Weekend trail walk',
      },
      {
        username: 'taylor.trails',
        type: 'swimming',
        durationMinutes: 30,
        calories: 230,
        date: new Date('2026-10-02T18:00:00.000Z'),
        notes: 'Relaxed lap swim',
      },
      {
        username: 'taylor.trails',
        type: 'walking',
        durationMinutes: 40,
        calories: 165,
        date: new Date('2026-09-28T09:30:00.000Z'),
        notes: 'Neighborhood walk with a friend',
      },
      {
        username: 'morgan.lifts',
        type: 'strength-training',
        durationMinutes: 35,
        calories: 225,
        date: new Date('2026-10-03T17:30:00.000Z'),
        notes: 'Moderate full-body workout',
      },
      {
        username: 'morgan.lifts',
        type: 'cycling',
        durationMinutes: 45,
        calories: 330,
        date: new Date('2026-09-29T08:00:00.000Z'),
        notes: 'Steady outdoor ride',
      },
      {
        username: 'casey.active',
        type: 'running',
        durationMinutes: 50,
        calories: 450,
        date: new Date('2026-10-05T07:00:00.000Z'),
        notes: 'Long easy run on the park trail',
      },
      {
        username: 'casey.active',
        type: 'walking',
        durationMinutes: 60,
        calories: 250,
        date: new Date('2026-09-30T10:00:00.000Z'),
        notes: 'Leisurely weekend walk',
      },
    ];

    for (const activity of activities) {
      const { username, ...activityFields } = activity;
      const user = getUser(username);
      const existingActivity = await Activity.findOne()
        .where('user')
        .equals(user._id)
        .where('type')
        .equals(activity.type)
        .where('date')
        .equals(activity.date)
        .exec();
      if (!existingActivity) {
        await Activity.create({ ...activityFields, user: user._id });
      }
    }

    const leaderboardTotals = await Activity.aggregate<{
      _id: mongoose.Types.ObjectId;
      points: number;
    }>([
      { $match: { user: { $in: users.map((user) => user._id) } } },
      { $group: { _id: '$user', points: { $sum: '$durationMinutes' } } },
    ]);
    const pointsByUserId = new Map(
      leaderboardTotals.map(({ _id, points }) => [_id.toString(), points]),
    );
    const teamByUsername = new Map([
      ['alex.runner', 'Trail Blazers'],
      ['casey.active', 'Trail Blazers'],
      ['jordan.moves', 'Strength Squad'],
      ['morgan.lifts', 'Strength Squad'],
      ['sam.cycles', 'Weekend Movers'],
      ['taylor.trails', 'Weekend Movers'],
    ]);

    await Promise.all(
      users.map((user) =>
        Leaderboard.findOneAndUpdate(
          { user: user._id },
          {
            $set: {
              team: getTeam(teamByUsername.get(user.username) ?? '')._id,
              points: pointsByUserId.get(user._id.toString()) ?? 0,
            },
            $setOnInsert: { user: user._id },
          },
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
      {
        name: 'Trail Walk and Mobility',
        description: 'A relaxed outdoor walk followed by a gentle mobility cooldown.',
        category: 'walking',
        difficulty: 'beginner',
        durationMinutes: 40,
      },
      {
        name: 'Steady Lap Swim',
        description: 'A steady swim with short rests between comfortable-length laps.',
        category: 'swimming',
        difficulty: 'intermediate',
        durationMinutes: 35,
      },
      {
        name: 'Tempo Run Intervals',
        description: 'Alternate moderate running intervals with easy recovery jogs.',
        category: 'running',
        difficulty: 'advanced',
        durationMinutes: 40,
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
