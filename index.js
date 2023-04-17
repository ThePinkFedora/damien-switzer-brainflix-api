const fs = require("node:fs");
const express = require("express");
const app = express();

const readVideosData = () => JSON.parse(fs.readFileSync("./data/videos.json"));
const writeVideosData = (data) => fs.writeFileSync("./data/videos.json", data);

app.get("/", (req, res) => {
  const file = fs.readFileSync("./index.html");
  res.send(file);
});

app.get("/videos", (req, res) => {
  const { videos } = readVideosData();
  res.json(videos);
});

app.get("/videos/:videoId", (req, res) => {
  const { videoId } = req.params;
  const { videoDetails: videoDetailsList } = readVideosData();
  const video = videoDetailsList.find((video) => video.id === videoId);
  res.json(video);
});

app.listen(80, () => console.log("Server is running: " + new Date()));
