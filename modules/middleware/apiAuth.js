const jwt = require("jsonwebtoken");
const User = require(`${config.path.model}/User`);

module.exports = (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    return jwt.verify(token, config.JWT_SECRET, (err, decode) => {
        console.log(decode)
      if (err) {
        return res.json({
          success: false,
          data: "failed to authenticate token",
        });
      }
      User.findById(decode.user_id)
        .then((user) => {
          if (user) {
            user.token = token;
            req.user = user;

            next();
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({
            success: false,
            data: "User not found",
          });
        });
    });
  }
  return res.status(403).json({
    data: "No Token Provided",
    success: false,
  });
};