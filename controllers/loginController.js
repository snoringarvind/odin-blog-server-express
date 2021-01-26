const { body, validationResult, Result } = require("express-validator");
const User = require("../models/User");
const utils = require("../libs/utils");

exports.login_get = (req, res, next) => {
  res.json({ msg: "not implemented login form" });
};

exports.protected_route = [
  utils.verifyJWT,
  (req, res, next) => {
    if (res.locals.isAuthenticated) {
      return res.status(200).json(res.locals.user);
    } else {
      return res.status(403);
    }
  },
];
