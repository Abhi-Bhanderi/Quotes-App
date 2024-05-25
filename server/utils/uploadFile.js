require("dotenv").config();
const connectDB = require("../DB/connection");
const Quote = require("../model/quotesSchema");

const QuoteJSON = require("../data/quote.json");

const Upload = async () => {
  try {
    await connectDB(process.env.MONGO_CONN_URI);
    await Quote.create(QuoteJSON);
    console.log("Successfully added");
  } catch (error) {
    console.log(error);
  }
};
Upload();
