const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../models/User");

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  // to test in postman: login with a user in the login POST route, copy the token you get in response and then, in the get route (this route!) add a header with key: x-auth-token value: the-copied-token
  try {
    // get user from the db assuming we send the correct token
    // use .select method to not return the password (even though it's encrypted)
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Auth/login user | get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    // send back errors, if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      // send msg if user not found
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      // compared hashed pwd
      const isMatch = await bcrypt.compare(password, user.password);
      // sned msg if pwd doens't match
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      // if pwd match:
      // generate jwt with payload and secret, send back token as json
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        {
          // 3600 is an hour, put 100h in dev so it doesn't expire while we test
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
