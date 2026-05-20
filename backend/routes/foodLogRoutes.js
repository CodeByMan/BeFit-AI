const express = require('express');
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const ctrl = require('../controllers/foodLogController');
const multer = require('multer');
const path = require('path');

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/foodlogs'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CRUD routes
router.post('/', protect([2]), ctrl.create);
router.get('/', protect([2]), ctrl.list);
router.get('/daily-summary', protect([2]), ctrl.dailySummary);
router.get('/:id', protect([2]), ctrl.get);
router.put('/:id', protect([2]), ctrl.update);
router.delete('/:id', protect([2]), ctrl.remove);
router.get('/:id/export-pdf', protect([2]), ctrl.exportPdf);

// Upload files
router.post('/upload', protect([2]), upload.array('files'), async (req, res) => {
  try {
    const log = await FoodLog.findById(req.body.logId);
    if (!log) return res.status(404).json({ message: 'Food log not found' });

    req.files.forEach(file => {
      log.attachments.push({
        url: `/uploads/foodlogs/${file.filename}`,
        type: file.mimetype.includes('pdf') ? 'pdf' : 'image'
      });
    });

    await log.save();
    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload files' });
  }
});

module.exports = router;
