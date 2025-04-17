var express = require("express");
var router = express.Router();
const {
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
} = require("../service/user.service");
const { authMiddleware } = require("../middleware/auth.middleware");
// const { checkUserRole } = require('../middleware/admin.middleware')

router.post("/register", async (req, res, next) => registerUser(req, res));

router.post("/login", async (req, res) => await loginUser(req, res));

router.put("/update/:id", authMiddleware, async (req, res) =>
  updateUser(req, res)
);

router.delete("/delete/:id", authMiddleware, async (req, res) =>
  deleteUser(req, res)
);

module.exports = router;
