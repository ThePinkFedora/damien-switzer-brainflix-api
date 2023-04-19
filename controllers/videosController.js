const fs = require("node:fs");
const { v4 } = require("uuid");

const readVideosData = () => JSON.parse(fs.readFileSync("./data/videos.json"));
const writeVideosData = (data) => fs.writeFileSync("./data/videos.json", JSON.stringify(data));

/**
 * @param {string} title
 * @param {string} channel
 * @param {string} image
 * @param {string} description
 */
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

function get(req, res) {
  const videos = readVideosData().map((video) => ({
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
  }));
  res.json(videos);
}

function post(req, res) {
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
}

function getVideo(req, res) {
  const { videoId } = req.params;
  const videos = readVideosData();
  const video = videos.find((video) => video.id === videoId);
  res.json(video);
}

function putVideoLike(req, res) {
  const { videoId } = req.params;
  const videos = readVideosData();
  const video = videos.find((video) => video.id === videoId);
  video.likes = (parseInt(video.likes.replaceAll(",", "")) + 1).toLocaleString("en-us");
  writeVideosData(videos);
  res.json(video);
}

module.exports = { get, post, getVideo, putVideoLike, read: readVideosData, write: writeVideosData };
