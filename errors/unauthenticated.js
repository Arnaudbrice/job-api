const { StatusCodes } = require("http-status-codes");
// const CustomAPIError = require('./custom-api');

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
