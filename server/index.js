const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./DB/connection");

// Configration
dotenv.config();

// Import routes
const quotesRoutes = require("./routes/quotesRoutes");
const userDataRuotes = require("./routes/userDataRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { defaultError } = require("./middleware/errorHandler");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// route Middlewares
app.use("/api/quotes", quotesRoutes);
app.use("/api/userData", userDataRuotes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use(defaultError);

const PORT = 7000 || process.env.PORT;
const Mongodb_pass = process.env.MONGO_PASS;

// Starting the Server and connecting to the Database
const start = async () => {
  try {
    await connectDB(Mongodb_pass);
    app.listen(PORT, () => {
      console.log(`- Server is on running ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
