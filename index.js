require("dotenv").config();
const fs = require("node:fs");
const express = require("express");
const app = express();
const cors = require("cors");
const videosRoutes = require("./routes/videos");

const { PORT } = process.env;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} | ${new Date().toLocaleTimeString()}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/videos", videosRoutes);

app.get("/", (req, res) => {
  const indexFile = fs.readFileSync("./index.html", "utf8");
  res.send(indexFile);
});

app.listen(PORT, () => console.log("Server is running | " + new Date()));
