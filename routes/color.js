var express = require("express");
var router = express.Router();

const { authMiddleware, managerWebsiteMiddleware } = require("../middleware/auth.middleware");

const {
  getAllColors,
  createColor,
  updateColor,
  deleteColor,
} = require("../service/color.service");

router.get("/get-all-colors", async (req, res, next) => getAllColors(req, res));

router.post(
  "/create-color",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => createColor(req, res)
);

module.exports = router;
