const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const controller = require("../controllers/testimonialController");

// USER submits testimonial
router.post("/", protect([2]), controller.createTestimonial);

// HOME page loads testimonials
router.get("/", controller.getTestimonials);

// ADMIN deletes testimonial
router.delete("/:id", protect([1]), controller.deleteTestimonial);

module.exports = router;
