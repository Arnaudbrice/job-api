const mongoose = require("mongoose");

const connectDB = url => {
  // Connect to the mongoDB database
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
};

module.exports = connectDB;
