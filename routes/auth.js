const express = require("express");
// create a Router object to define routes and their corresponding route handlers
const router = express.Router();

const { login, register } = require("../controllers/auth");
//**** Sets up routes and their corresponding route handlers for authentication.****
// Route for user login
router.post("/login", login);
// Route for user registration
router.post("/register", register);

module.exports = router;
