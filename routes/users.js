const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../models/User");

// to test the route in POSTMAN need to put Content-Type: application/json en header
// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    // validation with express-validator
    check("name", "Please add a name")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Plese enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // send back errors, if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      // create new user
      user = new User({ name, email, password });
      // salt and hash pwd
      user.password = await bcrypt.hash(password, 8);
      // save to db
      await user.save();
      // object we want to send in the token
      const payload = {
        user: {
          id: user.id
        }
      };
      // generate jwt with payload and secret, send back token as json if succeeds
      jwt.sign(
        payload,
        config.get("jwtSecret"),
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
