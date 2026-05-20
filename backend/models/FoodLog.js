const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: "" },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 }
});

const MealSchema = new mongoose.Schema({
  name: { type: String, default: "Meal" },
  items: [FoodItemSchema],
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 }
  }
});

const AttachmentSchema = new mongoose.Schema({
  url: { type: String },
  type: { type: String, enum: ['image', 'pdf'] }
});

const FoodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: "Meal Plan" },
  meals: [MealSchema],
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 }
  },
  date: { type: Date, required: true },
  attachments: [AttachmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('FoodLog', FoodLogSchema);
