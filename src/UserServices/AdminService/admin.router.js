const express = require("express");
const adminController = require("./admin.controller");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.route("/report").get(adminController.getReports)
router.route("/import-users").post(upload.single("file"), adminController.importUsers)

module.exports = router;