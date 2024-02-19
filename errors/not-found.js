const { StatusCodes } = require("http-status-codes");
// const CustomAPIError = require('./custom-api');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
