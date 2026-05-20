const express = require("express");
const multer = require("multer");
const FoodLog = require("../models/FoodLog");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/:id/upload", upload.single("file"), async (req, res) => {
  const log = await FoodLog.findById(req.params.id);

  log.attachments.push({
    url: `/uploads/${req.file.filename}`,
    type: req.file.mimetype.includes("pdf") ? "pdf" : "image"
  });

  await log.save();
  res.json(log);
});

module.exports = router;
