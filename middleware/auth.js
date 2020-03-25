const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // get the token from headers
  const token = req.header("x-auth-token");

  // send msg if token not found
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // verify the token in the header with the secret in our default.json
    const decoded = jwt.verify(token, process.env.jwtSecret);
    // the payload is now in decoded, we get the user from the payload and assign him to the request object
    req.user = decoded.user;
    // we move on by calling next()
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
