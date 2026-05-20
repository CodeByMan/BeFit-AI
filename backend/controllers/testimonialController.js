const Testimonial = require("../models/Testimonial");

// USER → Create or Update testimonial
exports.createTestimonial = async (req, res) => {
  try {
    // Check if testimonial already exists for this user
    let testimonial = await Testimonial.findOne({ userId: req.user.id });

    if (testimonial) {
      // Update existing testimonial
      testimonial.message = req.body.message;
      testimonial.rating = req.body.rating || 5;
      await testimonial.save();
    } else {
      // Create new testimonial
      testimonial = await Testimonial.create({
        userId: req.user.id,
        message: req.body.message,
        rating: req.body.rating || 5,
      });
    }

    res.json({ success: true, testimonial });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUBLIC → Get approved testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .populate("userId", "name email");

    res.json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN → Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
