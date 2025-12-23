
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const dbconnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");


dbconnect();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5600;
app.listen(port, () => {
  console.log("server is running port " + port);
});
