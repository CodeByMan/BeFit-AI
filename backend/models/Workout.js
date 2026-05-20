const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sets: { type: Number, default: 0, min: 0 },
  reps: { type: [Number], default: [], min: 0 },
  weight: { type: [Number], default: [], min: 0 },
  notes: { type: String, trim: true, default: '' },
  volume: { type: Number, default: 0 }
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, trim: true, default: 'Workout' },
  date: { type: Date, default: Date.now, index: true },
  durationMinutes: { type: Number, default: 0, min: 0 },
  category: { type: String, enum: ['strength', 'cardio', 'mobility', 'other'], default: 'strength', index: true },
  exercises: { type: [ExerciseSchema], default: [] },
  tags: { type: [String], default: [] },

  // REQUIRED FOR NOTIFICATIONS
  done: { type: Boolean, default: false }
}, { timestamps: true });

// Text index
WorkoutSchema.index({ title: 'text', 'exercises.name': 'text', tags: 'text' });

// Pre-save volume calculation
WorkoutSchema.pre('save', function (next) {
  if (Array.isArray(this.exercises)) {
    this.exercises.forEach(ex => {
      const reps = Array.isArray(ex.reps) ? ex.reps.map(r => Number(r) || 0) : [];
      const weight = Array.isArray(ex.weight) ? ex.weight.map(w => Number(w) || 0) : [];
      ex.volume = reps.reduce((sum, r, i) => sum + r * (weight[i] || 0), 0);
    });
  }
});

module.exports = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
