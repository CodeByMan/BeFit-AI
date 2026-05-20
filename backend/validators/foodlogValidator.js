const Joi = require('joi');

// Validate individual food item
const foodItemSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.string().allow(""),
  calories: Joi.number().required(),
  protein: Joi.number().default(0),
  carbs: Joi.number().default(0),
  fats: Joi.number().default(0)
}).unknown(true); // allow extra keys like 'id'

// Validate a meal
const mealSchema = Joi.object({
  name: Joi.string().default("Meal"),
  items: Joi.array().items(foodItemSchema).min(1).required()
}).unknown(true); // allow extra keys like 'id'

// Validate the full food log
exports.createFoodLogSchema = Joi.object({
  title: Joi.string().default("Meal Plan"),
  meals: Joi.array().items(mealSchema).min(1).required(),
  date: Joi.date().required()
}).unknown(true); // allow extra keys at root level
