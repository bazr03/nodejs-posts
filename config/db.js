const mongoose = require("mongoose");

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("MongoDB connected successfully!!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = DBconnection;
