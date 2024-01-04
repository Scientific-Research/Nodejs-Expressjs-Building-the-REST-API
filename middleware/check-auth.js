const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    console.log(token);

    // when the Authorization header is not set at all, therefore, split fails!
    if (!token) {
      throw new Error("Authentication failed!");
    }
    // to verify our Token with our private key used to produce the Token
    const decodedToken = jwt.verify(
      token,
      "supersecret_dont_share0485762893465783465"
    );
    req.userData = { userId: decodedToken.userId }; // when there is no error in decodedToken,
    // to add userId extracted from Token to userData to req, hence, our userData in req contains userId!
    next(); // to continue
    // when there is an error in decodedToken, it will jump to cath()
  } catch (err) {
    // Authorization header succeeds but don't give us the desired Token
    const error = new HttpError("Authentication failed---!", 401);
    return next(error);
  }
};
