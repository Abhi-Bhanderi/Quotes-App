import connectDB from "../config/db.js";

const startServer = (app, port) => {
  connectDB(process.env.MONGO_PASS)
    .then(() => {
      app.listen(port, () => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `- Development build of app is running on port:`,
            `http://localhost:${port}`
          );
        } else if (process.env.NODE_ENV === "production") {
          console.log(
            `- Production build of app is running on port:`,
            `${port}`
          );
        } else {
          console.error("- No Node Environment Detected.");
          process.exit(1);
        }
      });
    })
    .catch(() => {
      console.log("- Error While Connecting to the Database...");
      process.exit();
    });
};

export default startServer;
