const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  intro: String,
  link: String,
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
