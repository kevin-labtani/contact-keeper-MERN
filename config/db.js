const mongoose = require("mongoose");


// grab uri with username and password from our env
const db = process.env.mongoURI;
// connect to mongodb atlas database
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    // exit Node with Uncaught Fatal Exception
    process.exit(1);
  }
};

module.exports = connectDB;
