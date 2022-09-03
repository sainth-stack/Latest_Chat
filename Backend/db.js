const mongoose = require("mongoose");
const url  = process.env.MONGO

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Database Connection Success!');
    console.log(url)
  } catch (err) {
    console.log('MongoDB Database Connection Failed!', err.message);
  }
};

module.exports = connectDB;