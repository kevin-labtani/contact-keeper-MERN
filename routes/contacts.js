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
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object based on what's submited
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    // try to find the contact in the db
    let contact = await Contact.findById(req.params.id);
    // send msg if contact not found
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    // make sure user owns contact, you can't update a contact from another user!
    // convert MongoDB ObjectId to a string to compare to the jwt payload
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // update the contact
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    // send the updated contact
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // try to find the contact in the db
    let contact = await Contact.findById(req.params.id);

    // send msg if contact not found
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    // make sure user owns contact, you can't update a contact from another user!
    // convert MongoDB ObjectId to a string to compare to the jwt payload
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // delete the contact
    await Contact.findByIdAndRemove(req.params.id);
    // inform use that the contact is deleted
    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
