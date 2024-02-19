const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//** Define the schema for the User model**
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name"],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    //**** Email Validation Regex ****
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provides valid email"
    ],
    unique: true //create unique index
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6
    // maxlength: 12
  }
});

//***** mongoose pre-save middleware  *****

//*uses bcrypt to hash the password before saving it to the db (using the mongoose pre middleware function on the userSchema)

// makes sure that when we save a user to the database using this schema  it will hash the password using bcrypt before saving it in the db
userSchema.pre("save", async function() {
  // generates a salt using bcrypt with a specified number of salt rounds.
  const salt = await bcrypt.genSalt(10);
  // add the password to the generated salt then hash it
  this.password = await bcrypt.hash(this.password, salt);
});

//****** mongoose instance method ******

// allows the server to generate a token( using the defined payload object , the secret and the lifetime of the token) that can be sent to the client and used in future requests to authenticate the user.
//!Note: the payload should have the property "userId" and "name"
userSchema.methods.createJWT = function() {
  return jwt.sign(
    { userId: this._id, name: this.name }, //payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

// checks if the provided  password  matches the  hashed password in the database
userSchema.methods.comparePassword = async function(providedPassword) {
  let isMatch = await bcrypt.compare(providedPassword, this.password);
  return isMatch;
};

//***** Create the User model based on the schema *****

//! Note: the creation of the User model will lead to the creation of the collection name "users" into the database
const User = mongoose.model("User", userSchema);

module.exports = User;
