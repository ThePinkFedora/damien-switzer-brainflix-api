const fs = require("node:fs");
const { v4 } = require("uuid");

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

/**
 * Retrieves the list of videos from the model.
 * @returns {Video[]}
 */
const readVideosData = () => JSON.parse(fs.readFileSync("./data/videos.json"));

/**
 * Writes the list of videos to the model.
 * @param {Video[]} data - The videos list.
 */
const writeVideosData = (data) => fs.writeFileSync("./data/videos.json", JSON.stringify(data));

/**
 * Returns a summary of each video.
 * @type {import("express").RequestHandler}
 */
function get(req, res) {
  res.json(
    req.routeData.videos.map((video) => ({
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    }))
  );
}

/**
 * Creates a new video. Returns the created video.
 * @type {import("express").RequestHandler}
 */
function post(req, res) {
  const { videos } = req.routeData;
  let { title, channel, thumbnailUrl, description } = req.body;
  const { thumbnail } = { ...req.files };

  if (!title || !description) {
    return res.status(400).json({
      error: "POST body must contain all requiredProperties",
      requiredProperties: ["title", "description"],
    });
  }

  //If a thumbnail was provided, save the file and set the correct URL.
  if (thumbnail) {
    const fileExt = /.[^.]+$/.exec(thumbnail.name);
    thumbnail.name = v4() + fileExt;
    thumbnail.mv("./public/images/" + thumbnail.name);
    thumbnailUrl = `/images/` + thumbnail.name;
  }

  const newVideo = new Video(title, channel ?? "BrainFlix User", thumbnailUrl, description);
  videos.push(newVideo);
  writeVideosData(videos);

  res.status(201);
  res.send(newVideo);
}

/**
 * Returns a specific video.
 * @type {import("express").RequestHandler}
 */
function getVideo(req, res) {
  res.json(req.routeData.video);
}

/**
 * Puts a like on a video. Returns the video.
 * @type {import("express").RequestHandler}
 */
function putVideoLike(req, res) {
  const { video, videos } = req.routeData;

  video.likes = (parseInt(video.likes.replaceAll(",", "")) + 1).toLocaleString("en-us"); //Increment likes
  writeVideosData(videos);
  res.status(201).json(video);
}

/**
 * Middleware for reading videos list and setting it up in route data.
 * @type {import("express").RequestHandler}
 */
function preprocess(req, res, next) {
  const routeData = {
    videos: readVideosData(),
  };

  req.routeData = routeData;
  next();
}

/**
 * Middleware for validating videoId and adding video to route data.
 * @type {import("express").RequestHandler}
 */
function preprocessVideoId(req, res, next) {
  const { videoId } = req.params;
  const { videos } = req.routeData;

  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).json({
      message: "No video with that id exists.",
    });
  }

  req.routeData.video = video;
  next();
}

module.exports = { get, post, getVideo, putVideoLike, read: readVideosData, write: writeVideosData, preprocess, preprocessVideoId };
