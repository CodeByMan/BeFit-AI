const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    full_name: { // fetch from logged-in user
      type: String,
      required: true,
      trim: true,
    },
    avatar_filename: { // store only filename
      type: String,
      default: null,
    },
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    setup_complete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
