const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect to mongoDB
connectDB();

// middleware
// parse incoming json to an object
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the Contact Keeper API" })
);

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}!`);
});
