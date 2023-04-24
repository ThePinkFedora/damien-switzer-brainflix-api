const express = require("express");
const router = express.Router();
const { postComment, deleteComment } = require("../controllers/commentsController");

router.post("/", postComment);
router.delete("/:commentId", deleteComment);

module.exports = router;
