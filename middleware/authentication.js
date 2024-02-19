const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

//********** middleware function to handle all requests to paths starting with "/api/v1/jobs"  **********
const authenticateUser = async (req, res, next) => {
  // retrieves the value of the authorization property from the header of the http request
  const authHeader = req.headers.authorization;

  // checks if there is not an authorization property in the request headers or if there is not an authorization property in the request headers beginning with a Bearer prefix
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  //retrieves token from the Bearer token
  /*  example of bearer token : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksInVzZXJuYW1lIjoiSm9obiIsImlhdCI6MTcwNTY3NjgxNCwiZXhwIjoxNzA4MjY4ODE0fQ.gCsnhwVyHb2tqaYK_T2XgTeNdLTT2q2Lc74mY4xW9Lo */
  const token = authHeader.split(" ")[1];

  //verify token
  try {
    //- token: The JWT that you want to verify.
    //- process.env.JWT_SECRET: The secret key used to sign the JWT during its creation.
    // verifies the authenticity of the token using a secret and decodes its payload.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    /*     const user = User.findById(payload.userId).select("-password");
     */

    // console.log(
    //   payload
    // );
    /* {
  userId: '65c3cc960ecaf406c849ac04',
  name: 'bertrand',
  iat: 1707330734,
  exp: 1709922734
} */
    // access userId and name from the decoded payload
    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticateUser;
