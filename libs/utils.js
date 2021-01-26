const jwt = require("jsonwebtoken");
require("dotenv/config");
const bcrypt = require("bcrypt");

const saltRounds = 10;

exports.issueJWT = (user) => {
  const options = {
    expiresIn: "1d",
    algorithm: "HS256",
  };

  const payload = {
    name: user.username,
    sub: user.id,
    admin: user.admin,
    iat: Date.now(),
  };
  // console.log("user", user);

  const token = jwt.sign(payload, process.env.SECRET, options);
  console.log("token=", token);
  return {
    token,
    iat: payload.iat,
    expiresIn: options.expiresIn,
    user: user.id,
  };
};

exports.verifyJWT = (req, res, next) => {
  try {
    console.log(req.headers);
    // console.log("headers12", req.headers.authorization);
    const bearerToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(bearerToken, process.env.SECRET);
    console.log(decoded);
    res.locals.user = decoded;
    console.log("success");
    return next();
  } catch (err) {
    // console.log("failed");
    res.locals.isAuthenticated = false;
    return res.status(403).json({ isAuthenticated: false, msg: err.message });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (res.locals.user.admin) {
    res.locals.isAuthenticated = true;
    // console.log("passed");
    return next();
  } else {
    // console.log("failed");
    return res.status(403).json({ data: { msg: { isAuthenticated: false } } });
  }
};

exports.hashPassword = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    res.locals.storeHash = hash;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.comparePassword = async (req, res, next) => {
  try {
    const isPassTrue = await bcrypt.compare(
      res.locals.plainPassword,
      res.locals.user.password
    );
    // console.log(isPassTrue);
    res.locals.isPassTrue = isPassTrue;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
