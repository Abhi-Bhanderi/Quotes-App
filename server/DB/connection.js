const mongoose = require("mongoose");
const connectDB = async (MONGO_PASS) => {
  const CONNECTION_URL = `mongodb+srv://AbhiBhanderi:${MONGO_PASS}@nikhilquotes.2px3oxk.mongodb.net/data?retryWrites=true&w=majority&appName=NikhilQuotes`;
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
    });
    console.log(`- Database connection has been established...`);
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    console.log("- Shutting down the server...");
    process.exit(1);
  }
  mongoose.connection.on("disconnected", () => {
    console.log("- Database connection disconnected!");
  });
};

module.exports = connectDB;
