const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, default: "" } // optional, OTP login এ লাগবে না
  },
  { timestamps: true }
);

module.exports = mongoose.model("User-mk", userSchema);
