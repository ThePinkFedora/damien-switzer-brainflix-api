const fs = require("node:fs");
const express = require("express");
const app = express();
const cors = require("cors");
const videosRoutes = require("./routes/videos");

app.use(cors());
app.use(express.json());
app.use("/static", express.static("public"));

app.use("/videos", videosRoutes);

app.get("/", (req, res) => {
  const indexFile = fs.readFileSync("./index.html", "utf8");
  res.send(indexFile);
});

app.listen(80, () => console.log("Server is running: " + new Date()));
