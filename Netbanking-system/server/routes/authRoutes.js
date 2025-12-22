const express = require("express");
const router = express.Router();
const authctrl = require('../controllers/authController');

router.post('/register',authctrl.register);
router.post('/login',authctrl.login);

router.post('/otp/send',authctrl.sendOtp);
console.log(authctrl.sendOtp);
router.post('/otp/verify',authctrl.verifyOtp);

router.get('/dashboard',authctrl.dashboard);

module.exports = router;