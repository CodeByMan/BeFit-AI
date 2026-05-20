const Joi = require('joi');

const ExerciseSchema = Joi.object({
  name: Joi.string().required(),
  sets: Joi.number().min(0).required(),
  reps: Joi.array().items(Joi.number().min(0)).required(),      // <--- change here
  weight: Joi.array().items(Joi.number().min(0)).required(),    // <--- change here
  notes: Joi.string().allow(''),
});

const createWorkoutSchema = Joi.object({
  title: Joi.string().required(),
  durationMinutes: Joi.number().min(0).required(),
  category: Joi.string().valid('strength', 'cardio', 'mobility', 'other').required(),
  date: Joi.date().required(),
  exercises: Joi.array().items(ExerciseSchema).required(),
  tags: Joi.array().items(Joi.string()),
});

const updateWorkoutSchema = createWorkoutSchema.fork(
  ['title', 'durationMinutes', 'category', 'date', 'exercises'], 
  (schema) => schema.optional()
);

module.exports = { createWorkoutSchema, updateWorkoutSchema };
