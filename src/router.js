const express = require("express");
const router = express.Router();

router.use("/auth", require("./UserServices/AuthService/auth.router"));
router.use("/admin", require("./UserServices/AdminService/admin.router"));

module.exports = router;
