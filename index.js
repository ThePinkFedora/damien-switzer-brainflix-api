require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const videosRoutes = require("./routes/videos");

const { PORT, CORS_ORIGIN } = process.env || 8080;

//Log requests
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path} | ${new Date().toLocaleTimeString()}`);
  next();
});

app.use(cors({ origin: CORS_ORIGIN }));

app.use(express.json());

app.use(fileUpload());

app.use(express.static("public"));

app.use("/videos", videosRoutes);

app.listen(PORT, () => console.log("Server is running | " + new Date().toLocaleString()));
