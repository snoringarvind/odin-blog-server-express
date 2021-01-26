const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const utils = require("../libs/utils");

//having signup in guest, since the client One is already set
exports.signup_get = (req, res, next) => {
  res.json({ msg: "not implemented" });
};

exports.signup_post = [
  body("admin").escape(),
  body("fname", "fname cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("lname", "lname cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("email", "email cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("username", "username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  utils.hashPassword,

  (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      username: req.body.username,
      password: res.locals.storeHash,
    });

    if (!errors.isEmpty()) {
      return res.json(errors);
    } else {
      User.findOne({ username: req.body.username }, (err, theUser) => {
        console.log(theUser);
        if (err) return res.status(500).json({ msg: err.message });
        if (theUser != null) {
          return res.status(406).json({
            msg:
              "A user with this username already exists. Please chose a different username.",
          });
        } else {
          user.save((err) => {
            if (err) {
              return res.json({ msg: err.message });
            } else {
              return res.json(user);
            }
          });
        }
      });
    }
  },
];

exports.blog_detail_get = (req, res, next) => {
  Blog.findById(req.params.id).exec((err, result) => {
    if (err) return res.json({ msg: err.message });
    if (result == null) return res.status(401).json({ msg: "no blog found" });
    else {
      return res.json(result);
    }
  });
};

exports.comment_get = (req, res, next) => {
  Comment.find({ blog: req.params.id })
    .populate("user")
    .exec((err, result) => {
      console.log(result);
      if (err) return res.status(500).json({ msg: err.message });
      if (result.length == 0) {
        return res.status(200).json({ msg: "no comments found" });
      }
      return res.status(200).json(result);
    });
};

exports.comment_create_post = [
  body("comment", "comment cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("user").trim().escape(),
  (req, res, next) => {
    // console.log("user=", res.locals.user.sub);
    const errors = validationResult(req);
    const comment = new Comment({
      comment: req.body.comment,
      user: res.locals.user.sub,
      blog: req.params.id,
    });
    // console.log(("comment=", comment));
    // console.log(errors.array());
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      comment.save((err) => {
        if (err) return res.json({ msg: err.message });
        return res.json(comment);
      });
    }
  },
];

exports.isVerified = (req, res, next) => {
  return res.status(200).json({ msg: { isAuthenticated: true } });
};

exports.login_post = [
  body("username", "username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log("errors", errors);
    if (!errors.isEmpty()) {
      return res.status(401).json(errors.array());
    } else {
      User.findOne({ username: req.body.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        if (result == null) {
          return res
            .status(401)
            .json({ msg: "no such user with that username" });
        } else {
          res.locals.plainPassword = req.body.password;
          res.locals.user = result;
          next();
        }
      });
    }
  },
  utils.comparePassword,
  (req, res, next) => {
    if (!res.locals.isPassTrue) {
      return res.status(401).json({ msg: "wrong password" });
    } else {
      const jwtResponse = utils.issueJWT(res.locals.user);
      return res.status(200).json({ jwt: jwtResponse });
    }
  },
];

exports.comment_delete = (req, res, next) => {
  Comment.findById(req.params.commentid)
    .populate("user")
    .exec((err, result) => {
      console.log("result=", result.user.username);
      console.log(res.locals.user.name);
      if (err) return res.status(500).json({ msg: err.message });
      if (result.user.username != res.locals.user.name)
        return res
          .status(403)
          .json({ msg: "this is not your comment to delete" });
      else {
        Comment.findByIdAndRemove(req.params.commentid, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
          else {
            return res
              .status(200)
              .json({ msg: "this comment has been successfully removed" });
          }
        });
      }
    });
};
