const FoodLog = require('../models/FoodLog');

const calculateMealTotals = (items) => {
  return items.reduce(
    (acc, i) => {
      acc.calories += Number(i.calories) || 0;
      acc.protein += Number(i.protein) || 0;
      acc.carbs += Number(i.carbs) || 0;
      acc.fats += Number(i.fats) || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

const calculateLogTotals = (meals) => {
  return meals.reduce(
    (acc, meal) => {
      const t = meal.totals || calculateMealTotals(meal.items || []);
      acc.calories += t.calories;
      acc.protein += t.protein;
      acc.carbs += t.carbs;
      acc.fats += t.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

const createFoodLog = async (userId, data) => {
  const meals = data.meals.map((meal) => ({
    ...meal,
    totals: calculateMealTotals(meal.items)
  }));
  const totals = calculateLogTotals(meals);
  return FoodLog.create({ ...data, meals, totals, user: userId });
};

const updateFoodLog = async (userId, logId, data) => {
  const log = await FoodLog.findOne({ _id: logId, user: userId });
  if (!log) throw new Error("Food log not found");

  const meals = data.meals.map((meal) => ({
    ...meal,
    totals: calculateMealTotals(meal.items)
  }));

  const totals = calculateLogTotals(meals);

  log.title = data.title || log.title;
  log.date = data.date;
  log.meals = meals;
  log.totals = totals;

  return log.save();
};

const getDailySummary = async (userId, date) => {
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(date);
  end.setHours(23,59,59,999);

  const logs = await FoodLog.find({
    user: userId,
    date: { $gte: start, $lte: end }
  });

  return logs.reduce(
    (acc, log) => {
      acc.caloriesIn += log.totals.calories;
      acc.protein += log.totals.protein;
      acc.carbs += log.totals.carbs;
      acc.fat += log.totals.fats;
      return acc;
    },
    { caloriesIn: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

module.exports = { createFoodLog, updateFoodLog, getDailySummary };
