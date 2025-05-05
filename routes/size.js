var express = require("express");
var router = express.Router();

const {
  authMiddleware,
  managerWebsiteMiddleware,
} = require("../middleware/auth.middleware");

const {
  getAllSizes,
  createSize,
  updateSize,
  deleteSize,
} = require("../service/size.service");

router.get("/get-all", async (req, res, next) => getAllSizes(req, res));

router.post(
  "/create-size",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => createSize(req, res)
);

router.put(
  "/update",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => updateSize(req, res)
);

router.delete(
  "/delete",
  authMiddleware,
  managerWebsiteMiddleware,
  async (req, res, next) => deleteSize(req, res)
);

module.exports = router;
