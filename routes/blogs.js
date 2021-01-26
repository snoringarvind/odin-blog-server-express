const express = require("express");
const router = express.Router();
const homePageController = require("../controllers/homePageController");
const guestController = require("../controllers/guestController");
const loginController = require("../controllers/loginController");
const adminController = require("../controllers/adminController");
const utils = require("../libs/utils");

//home page //* '/blogs' list page
router.get("/blogs", homePageController.blog_list);

//create blog
router.get(
  "/blogs/create",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.blog_create_get
);
router.post(
  "/blogs",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.blog_create_post
);

//signup
router.get("/blogs/signup", guestController.signup_get);
router.post("/blogs/signup", guestController.signup_post);

//admin login
//*different login route for admin since admin needs to be veirified;
router.post("/blogs/admin-login", adminController.login_post);

//guest-login
router.post("/blogs/login", guestController.login_post);

//protected
router.get("/blogs/protected", loginController.protected_route);

//is admin-verified
//*if yes then don't show login page else, show login page
router.post(
  "/blogs/is-admin-verified",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.isVerified
);

//is guest-verifed
//*If yes then don't show login page else show login page
router.post(
  "/blogs/is-guest-verified",
  utils.verifyJWT,
  guestController.isVerified
);

//update blog
router.get(
  "/blog/:id/update",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.blog_update_get
);

router.put(
  "/blog/:id",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.blog_update_put
);

//comment
router.post(
  "/blog/:id/comment",
  utils.verifyJWT,
  guestController.comment_create_post
);
router.get("/blog/:id/comment", guestController.comment_get);

//delete blog
router.delete(
  "/blog/:id",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.blog_delete
);

//delete comment
router.delete(
  "/blog/:id/comment/:commentid",
  utils.verifyJWT,
  utils.verifyAdmin,
  adminController.comment_delete
);

//delete comment guest
router.delete(
  "/blog/:id/comment/:commentid/guest",
  utils.verifyJWT,
  guestController.comment_delete
);
//get detail
router.get("/blog/:id", guestController.blog_detail_get);

module.exports = router;
