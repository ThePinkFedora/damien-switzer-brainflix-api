const fs = require("node:fs");
const express = require("express");
const router = express.Router();
const { v4 } = require("uuid");

const readVideosData = () => JSON.parse(fs.readFileSync("./data/videos.json"));
const writeVideosData = (data) => fs.writeFileSync("./data/videos.json", JSON.stringify(data));

function Video(title, channel, image, description) {
  this.id = v4();
  this.title = title;
  this.channel = channel;
  this.description = description;
  this.image = image;
  this.views = "0";
  this.likes = "0";
  this.duration = "0:00";
  this.video = "https://project-2-api.herokuapp.com/stream";
  this.timestamp = new Date().getTime();
  this.comments = [];
}

router
  .route("/")
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
    const { title, channel, image, description } = req.body;

    if (!title || !description) {
      res.status(400);
      res.json({
        error: "POST body must contain all requiredProperties",
        requiredProperties: ["title", "description"],
      });
    }

    const newVideo = new Video(title, channel ?? "BrainFlix User", image ?? "", description);
    videos.push(newVideo);
    writeVideosData(videos);

    res.status(201);
    res.send(newVideo);
  });

router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;
  const videos = readVideosData();
  const video = videos.find((video) => video.id === videoId);
  res.json(video);
});

module.exports = router;
