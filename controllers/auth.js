const User = require("../models/User");
// import StatusCodes Object from the http-status-codes nodeJS module
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

//****** route handler for the user registration ******
const register = async (req, res) => {
  // create a new user object from the request body(using the entered data)
  const user = await User.create(req.body);

  /* calls the defined mongoose instance method to generate a JWT for the user and sends it back to the client in the response*/
  const token = user.createJWT();

  // res.status(StatusCodes.CREATED).json({ user });

  //send the response to the user with the signed token and information about him
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

//****** route handler for the user login ******
const login = async (req, res) => {
  const { email, password } = req.body;
  // checks if the user provides email or password
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // Finds User that match the entered email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  //****** compare password (passwort authentication using bcrypt  (hashing and salting)) ******
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  /* calls the defined mongoose instance method to generate a JWT for the user and sends it back to the client in the response*/
  // Create a new JWT Token again
  const token = user.createJWT();
  //send the response to the user with the new signed token and information about him
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
