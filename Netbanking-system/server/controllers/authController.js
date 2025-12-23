const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digit
}

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// ✅ SEND OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "email required" });

  try {
    const otp = genOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // ✅ FIX: findOneAndUpdate (not findByIdAndUpdate)
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { otpHash, expiresAt, attemptsLeft: 5 },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    res.json({ message: "otp sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "otp send failed" });
  }
};

// ✅ VERIFY OTP (Login/Create user + token)
exports.verifyOtp = async (req, res) => {
  const { email, otp, name } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "email & otp required" });

  const normEmail = email.toLowerCase().trim();

  try {
    const otpDoc = await Otp.findOne({ email: normEmail });
    if (!otpDoc) return res.status(400).json({ message: "otp not found" });

    // expiry check
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ email: normEmail });
      return res.status(400).json({ message: "otp expired" });
    }

    // attempts check
    if (otpDoc.attemptsLeft <= 0) {
      await Otp.deleteOne({ email: normEmail });
      return res.status(400).json({ message: "too many attempts" });
    }

    const ok = await bcrypt.compare(String(otp), otpDoc.otpHash);

    // ✅ wrong otp হলে attempts কমবে
    if (!ok) {
      otpDoc.attemptsLeft -= 1;
      await otpDoc.save();
      return res.status(400).json({ message: "invalid otp" });
    }

    // ✅ correct -> delete otp
    await Otp.deleteOne({ email: normEmail });

    // ✅ user না থাকলে create করে OTP login
    let user = await User.findOne({ email: normEmail });
    if (!user) {
      user = await User.create({ email: normEmail, name: name || "" });
    } else if (name && !user.name) {
      user.name = name;
      await user.save();
    }

    const token = signToken(user);

    res.json({
      message: "otp login success",
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "otp verify failed" });
  }
};


exports.dashboard = (req, res) => {
  res.json({ message: "welcome to dashboard", user: req.user });
};
