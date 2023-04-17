const fs = require("node:fs");
const express = require("express");
const app = express();
const { v4 } = require("uuid");

const readVideosData = () => JSON.parse(fs.readFileSync("./data/videos.json"));
const writeVideosData = (data) => fs.writeFileSync("./data/videos.json", JSON.stringify(data));

function Video(title = "", channel = "", image = "") {
  this.id = v4();
  this.title = title;
  this.channel = channel;
  this.image = image;
  this.views = "0";
  this.likes = "0";
  this.duration = "0:00";
  this.timestamp = new Date().getTime();
  this.comments = [];
}

app.get("/", (req, res) => {
  const indexFile = fs.readFileSync("./index.html", "utf8");
  res.send(indexFile);
});

app
  .route("/videos")
  .get((req, res) => {
    const videos = readVideosData().map((video) => ({
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    }));
    res.json(videos);
  })
  .post((req, res) => {
    const videos = readVideosData();
    const newVideo = new Video(`New Video (${videos.length + 1})`, "BrainFlix User", "/images/image0.jpeg");
    videos.push(newVideo);
    writeVideosData(videos);

    res.status(201);
    res.send({ id: newVideo.id });
  });

app.get("/videos/:videoId", (req, res) => {
  const { videoId } = req.params;
  const videos = readVideosData();
  const video = videos.find((video) => video.id === videoId);
  res.json(video);
});

app.listen(80, () => console.log("Server is running: " + new Date()));
