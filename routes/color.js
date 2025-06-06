var express = require("express");
var router = express.Router();

const {
  authMiddleware,
  managerWebsiteMiddleware,
} = require("../middleware/auth.middleware");

const {
  getAllColors,
  createColor,
  updateColor,
  deleteColor,
} = require("../service/color.service");

router.get("/get-all", async (req, res, next) => getAllColors(req, res));

router.post(
  "/create",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => createColor(req, res)
);

router.put(
  "/update/:id",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => updateColor(req, res)
);

router.delete(
  "/delete/:id",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => deleteColor(req, res)
);

module.exports = router;
