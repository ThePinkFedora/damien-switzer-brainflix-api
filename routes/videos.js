const fs = require("node:fs");
const express = require("express");
const router = express.Router();
const { v4 } = require("uuid");

const { get, post, getVideo, putVideoLike } = require("../controllers/videosController");
const commentsRoute = require("./comments");

router.route("/").get(get).post(post);
router.get("/:videoId", getVideo);
router.put("/:videoId/likes", putVideoLike);
router.use(
  "/:videoId/comments",
  (req, res, next) => {
    req.videoId = req.params.videoId;
    next();
  },
  commentsRoute
);

module.exports = router;
