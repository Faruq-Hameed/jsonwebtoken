const express = require("express");
const router = express.Router()

const { register, login, update, deleteUser } = require("./auth");
router.route("/deleteUser").delete(deleteUser);
router.route("/update").put(update);
router.route("/register").post(register)
router.route("/login").post(login);

module.exports = router;
