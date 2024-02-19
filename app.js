require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

//********** connectDB **********

const connectDB = require("./db/connect");

//********** imports routers objects **********
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

//****** import Authentication middleware ******
const authenticateUser = require("./middleware/authentication");

//********** error handler **********
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//****** set up middleware to parse incoming  JSON and form data ******
// Middleware to parse incoming JSON AND Form data  from the http requests
// Parse JSON data
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: false }));

//****** set up middleware function to secure our API ******

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100 //limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

//********** set up route specific middleware **********
// set up authRouter as middleware to handle all http requests starting with  "/api/v1/auth"
app.use("/api/v1/auth", authRouter);
// set up jobRouter and authenticateUser as middleware to handle all http requests to path starting with  "/api/v1/jobs"
app.use("/api/v1/jobs", authenticateUser, jobRouter);

//******set up global middleware to handle error ******
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connect to mongodb database using the connection String for the database
    await connectDB(process.env.MONGO_URI);

    //connect to the server
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
