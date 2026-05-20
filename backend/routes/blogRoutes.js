// backend/routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// PUBLIC – get all blogs for homepage
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
