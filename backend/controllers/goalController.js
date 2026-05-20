const Goal = require("../models/Goal");

// Get logged-in user's goal
const getGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({ userId: req.user.id });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create or update logged-in user's goal
const createOrUpdateGoal = async (req, res) => {
    try {
        const goalData = req.body;

        const goal = await Goal.findOneAndUpdate(
            { userId: req.user.id },
            goalData,
            { new: true, upsert: true }
        );

        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getGoal,
    createOrUpdateGoal
};
