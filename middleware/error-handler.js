// Import necessary modules
// const { CustomAPIError } = require("../errors"); // Importing custom error class
const { StatusCodes } = require("http-status-codes"); // Importing HTTP status codes

// Define error handling middleware function
const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let errorMessage =
    err.message || "Something went wrong. Please try again later.";

  // Check if statusCode is a valid HTTP status code
  if (!StatusCodes[statusCode]) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR; // Set to INTERNAL_SERVER_ERROR if not valid
  }
  // In many Node.js applications, particularly those using Mongoose with MongoDB, validation errors are often named "ValidationError".

  //handle document fields with a required constraint
  //* mongoose handle validation error
  if (err.name === "ValidationError") {
    console.log(Object.values(err.errors));
    statusCode = StatusCodes.BAD_REQUEST; // Set status code to BAD_REQUEST on validation errors
    errorMessage = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
  }
  // submits the form with invalid data types
  //* mongoose handle cast error
  if (err.name === "CastError") {
    statusCode = StatusCodes.NOT_FOUND; // Set status code to NOT_FOUND on CastErrors
    errorMessage = `Resource not found with id: ${err.value}`;
  }

  // Customize error message for MongoDB validation error [error code 11000 due to MongoDB Duplicate Key( you attempt to insert the same value twice in a document field with a unique constraint ) ]
  //*mongoose handle duplicate key error
  if (err.code && err.code === 11000) {
    errorMessage = `Duplicate value entered for field ${Object.keys(
      err.keyValue
    )}. Please choose another value.`;
    statusCode = StatusCodes.BAD_REQUEST;
  }

  // Set response status code and send JSON response with error message
  res.status(statusCode).json({ errorMessage });
  // res.status(statusCode).json({ err });
};

// Export the error handling middleware function for use in Express application
module.exports = errorHandlerMiddleware;
