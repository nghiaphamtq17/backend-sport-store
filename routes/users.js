var express = require("express");
var router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User.model");
const {
  loginUser,
  registerUser,
  updateUser,
} = require("../service/user.service");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/register", async (req, res, next) => registerUser(req, res));

router.post("/login", async (req, res) => await loginUser(req, res));

router.put("/update/:id", authMiddleware , async (req, res) =>
  updateUser(req, res)
);

module.exports = router;
