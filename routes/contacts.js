const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const router = express.Router();

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    // we have access to req.user.id through the auth middleware (it's the jwt's payload)
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    // send the contacts founds in the db
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post(
  "/",
  // two middlewares, use [] and list them
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // send back errors, if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      // make new contact
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id //jwt payload form auth middleware
      });
      // save new contact to db
      const contact = await newContact.save();
      // send back contact as json
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put("/:id", (req, res) => {
  res.send("Update contact");
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete("/:id", (req, res) => {
  res.send("Delete contact");
});

module.exports = router;
