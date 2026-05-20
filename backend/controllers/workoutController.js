// backend/controllers/workoutController.js
const Workout = require('../models/Workout');
const { createWorkoutSchema, updateWorkoutSchema } = require('../validators/workoutValidator');
const asyncHandler = require('../middlewares/asyncHandler');
const mongoose = require('mongoose');

/**
 * Create a new workout
 */
exports.createWorkout = asyncHandler(async (req, res) => {
  const { error, value } = createWorkoutSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: 'Validation failed', details: error.details });

  const payload = {
    ...value,
    userId: req.user.id
  };

  const workout = new Workout(payload);
  await workout.save();
  res.status(201).json(workout);
});

/**
 * List/paginate/search workouts for current user
 */
exports.listWorkouts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    page = 1, limit = 10, search = '', category, dateFrom, dateTo, sort = '-date'
  } = req.query;

  const filter = { userId: new mongoose.Types.ObjectId(userId) };

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;

  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }

  const parsedLimit = Math.min(parseInt(limit, 10) || 10, 100);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

  const total = await Workout.countDocuments(filter);
  const workouts = await Workout.find(filter)
    .sort(sort)
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit)
    .lean();

  res.json({
    workouts,
    meta: { total, page: parsedPage, limit: parsedLimit, pages: Math.ceil(total / parsedLimit) }
  });
});

/**
 * Get single workout
 */
exports.getWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  const workout = await Workout.findById(id);
  if (!workout) return res.status(404).json({ message: 'Workout not found' });
  if (workout.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

  res.json(workout);
});

/**
 * Update workout
 */
exports.updateWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  const workout = await Workout.findById(id);
  if (!workout) return res.status(404).json({ message: 'Workout not found' });
  if (workout.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

  const { error, value } = updateWorkoutSchema.validate(req.body, { abortEarly: false, allowUnknown: false });
  if (error) return res.status(400).json({ message: 'Validation failed', details: error.details });

  Object.assign(workout, value);
  await workout.save();
  res.json(workout);
});

/**
 * Delete workout
 */
exports.deleteWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  const workout = await Workout.findById(id);
  if (!workout) return res.status(404).json({ message: 'Workout not found' });
  if (workout.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

  await Workout.findByIdAndDelete(id);
  res.json({ message: 'Workout deleted' });
});

/**
 * Analytics
 */
exports.getWorkoutAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const weeks = parseInt(req.query.weeks, 10) || 12;

  let toDate = req.query.toDate ? new Date(req.query.toDate) : new Date();
  let fromDate = req.query.fromDate ? new Date(req.query.fromDate) : new Date(toDate);

  if (!req.query.fromDate) fromDate.setDate(toDate.getDate() - weeks * 7);

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    date: { $gte: fromDate, $lte: toDate }
  };

  const analytics = await Workout.aggregate([
    { $match: match },
    { $unwind: { path: "$exercises", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" }
        },
        workoutIds: { $addToSet: "$_id" },
        totalVolume: { $sum: "$exercises.volume" }
      }
    },
    {
      $project: {
        week: "$_id.week",
        year: "$_id.year",
        workoutCount: { $size: "$workoutIds" },
        totalVolume: 1,
        _id: 0
      }
    },
    { $sort: { year: 1, week: 1 } }
  ]);

  const map = {};
  analytics.forEach(a => {
    map[`${a.year}-${a.week}`] = { workoutCount: a.workoutCount, totalVolume: a.totalVolume };
  });

  const buckets = [];
  const cur = new Date(fromDate);

  while (cur <= toDate) {
    const tmp = new Date(cur);
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));

    const yearStart = new Date(tmp.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);

    const key = `${tmp.getFullYear()}-${weekNo}`;
    const data = map[key] || { workoutCount: 0, totalVolume: 0 };

    buckets.push({
      label: `${tmp.getFullYear()}-W${String(weekNo).padStart(2, '0')}`,
      year: tmp.getFullYear(),
      week: weekNo,
      workoutCount: data.workoutCount,
      totalVolume: Number((data.totalVolume || 0).toFixed(2))
    });

    cur.setDate(cur.getDate() + 7);
  }

  res.json({ fromDate, toDate, buckets });
});

/**
 * Dashboard summary
 */
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const recent = await Workout.find({ userId }).sort({ date: -1 }).limit(5).lean();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyCounts = await Workout.aggregate([
    { $match: { userId, date: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, count: { $sum: 1 } } },
    { $sort: { "_id": 1 } }
  ]);

  const ninetyDays = new Date();
  ninetyDays.setDate(ninetyDays.getDate() - 90);

  const topExercises = await Workout.aggregate([
    { $match: { userId, date: { $gte: ninetyDays } } },
    { $unwind: "$exercises" },
    {
      $group: {
        _id: "$exercises.name",
        totalVolume: { $sum: "$exercises.volume" },
        maxWeight: { $max: "$exercises.weight" },
        occurrences: { $sum: 1 }
      }
    },
    { $sort: { totalVolume: -1 } },
    { $limit: 3 }
  ]);

  res.json({ recent, dailyCounts, topExercises });
});

/**
 * Export CSV
 */
const { Parser } = require('json2csv');

exports.exportWorkoutsCsv = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const workouts = await Workout.find({ userId }).lean();

  const flat = workouts.map(w => ({
    id: w._id.toString(),
    date: w.date.toISOString(),
    title: w.title,
    category: w.category,
    durationMinutes: w.durationMinutes,
    exercises: w.exercises.map(e => `${e.name}(${e.sets}x${e.reps}x${e.weight})`).join('; '),
    tags: (w.tags || []).join(', ')
  }));

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(flat);

  res.header('Content-Type', 'text/csv');
  res.attachment('workouts.csv');
  res.send(csv);
});

/**
 * GOOD NOTIFICATION SYSTEM
 * No timezone conversion — JS local date is correct.
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

  const tomorrowEnd = new Date(todayEnd);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  const [y, t, tm, f] = await Promise.all([
    Workout.find({ userId, done: false, date: { $gte: yesterday, $lte: yesterdayEnd } }).sort({ date: 1 }),
    Workout.find({ userId, done: false, date: { $gte: today, $lte: todayEnd } }).sort({ date: 1 }),
    Workout.find({ userId, done: false, date: { $gte: tomorrow, $lte: tomorrowEnd } }).sort({ date: 1 }),
    Workout.find({ userId, done: false, date: { $gt: tomorrowEnd } }).sort({ date: 1 })
  ]);

  res.json({ success: true, yesterday: y, today: t, tomorrow: tm, future: f });
});

/**
 * Mark workout done
 */
exports.markWorkoutDone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workout = await Workout.findById(id);

  if (!workout) return res.status(404).json({ message: "Workout not found" });
  if (workout.userId.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  workout.done = true;
  await workout.save();

  res.json({ success: true });
});
