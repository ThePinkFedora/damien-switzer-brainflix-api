const express = require("express");
const router = express.Router();
const { postComment, deleteComment } = require("../controllers/commentsController");

router.route("/").post(postComment).delete(deleteComment);

module.exports = router;
