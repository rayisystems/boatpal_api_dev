const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.post("/gpLogin", UserController.user_gpLogin);

router.post("/fbLogin", UserController.user_fbLogin);

router.post("/forgotPassword", UserController.user_reset_password_init);

router.put("/forgotPasswordConfirm", UserController.user_reset_password_finish);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
