const express = require('express');
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const controller = require('../controllers/workoutController');

router.post('/', protect([2]), controller.createWorkout);
router.get('/', protect([2]), controller.listWorkouts);
router.get('/analytics', protect([2]), controller.getWorkoutAnalytics);
router.get('/summary', protect([2]), controller.getDashboardSummary);
router.get('/export/csv', protect([2]), controller.exportWorkoutsCsv);

// Notifications
router.get("/notifications", protect([2]), controller.getNotifications);
router.patch("/:id/done", protect([2]), controller.markWorkoutDone);

router.get('/:id', protect([2]), controller.getWorkout);
router.put('/:id', protect([2]), controller.updateWorkout);
router.delete('/:id', protect([2]), controller.deleteWorkout);

module.exports = router;
