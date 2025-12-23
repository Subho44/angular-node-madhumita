const express = require("express");
const router = express.Router();

const authctrl = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/otp/send", authctrl.sendOtp);
router.post("/otp/verify", authctrl.verifyOtp);

router.get("/dashboard", authMiddleware, authctrl.dashboard);

module.exports = router;
