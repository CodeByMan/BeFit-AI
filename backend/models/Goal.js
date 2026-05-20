const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    currentHeight: { type: Number, required: true }, // New: current height in cm
    currentWeight: { type: Number, required: true }, // New: current weight in kg
    dailyCalories: { type: Number, required: true },
    dailyCarbs: { type: Number, required: true },
    dailyProtein: { type: Number, required: true },
    dailyFats: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    goalType: { type: String, enum: ["weight gain", "weight loss", "maintain"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);
