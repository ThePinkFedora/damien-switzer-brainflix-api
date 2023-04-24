const express = require("express");
const router = express.Router();
const { get, post, getVideo, putVideoLike, preprocess, preprocessVideoId } = require("../controllers/videosController");
const commentsRoute = require("./comments");

router.use(preprocess);
router.use("/:videoId", preprocessVideoId);

router.route("/").get(get).post(post);
router.get("/:videoId", getVideo);
router.put("/:videoId/likes", putVideoLike);

router.use("/:videoId/comments", commentsRoute);

module.exports = router;
