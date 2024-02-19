require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

/* The `swagger-ui-express` module is used to serve automatically generated API docs.*/
const swaggerUI = require("swagger-ui-express");

/* The `yamljs` module is used to parse YAML files or strings.*/
const YAML = require("yamljs");

/* Load and parse the Swagger document from the `swagger.yaml` file.*/
const swaggerDocument = YAML.load("./swagger.yaml");

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

// enable the trust proxy setting. This setting is important when your Express application is deployed behind a reverse proxy or a load balancer.
app.set("trust proxy", 1);
// Within any 15-minute period, each IP address is allowed to make up to 100 requests.
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
/**
 * Defines a route handler for the GET method on the path '/'.
 * This handler sends a response with a heading and a link to the API documentation.
 *
 * @name home
 * @path {GET} /
 * @response {string} HTML string - A heading with the text 'jobs API' and a link to '/api-docs'.
 */
app.get("/", (req, res) => {
  res.send("hover-bg-yellow");
  /*  res.send("<h1>jobs API</h1><a href='/api-docs'>Documentation</a>"); */
});

//******  Sets up the Swagger UI express middleware for serving API documentation. ******
/**
 * Sets up the Swagger UI express middleware for serving API documentation.
 * The Swagger UI is accessible from the `/api-docs` path.
 *
 * @name api-docs
 * @path {GET} /api-docs
 * @middleware {function} swaggerUI.serve - Serves the Swagger UI.
 * @middleware {function} swaggerUI.setup - Sets up the Swagger UI with the provided Swagger document.
 * @param {object} swaggerDocument - The Swagger document (JSON) for setting up the Swagger UI.
 */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const port = process.env.PORT || 10000;

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
