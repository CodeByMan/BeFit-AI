const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
      break;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection error (attempt ${retries}):`, error.message);
      if (retries === maxRetries) process.exit(1);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

module.exports = connectDB;
