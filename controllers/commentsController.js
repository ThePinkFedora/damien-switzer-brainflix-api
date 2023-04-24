const { v4 } = require("uuid");
const { write: writeVideos } = require("./videosController");

/**
 * @param {string} name
 * @param {string} comment
 */
function Comment(name, comment) {
  this.id = v4();
  this.name = name;
  this.comment = comment;
  this.likes = 0;
  this.timestamp = new Date().getTime();
}

/**
 * Creates a new comment. Returns the created comment.
 * @type {import("express").RequestHandler}
 */
function postComment(req, res) {
  const { videos, video } = req.routeData;

  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({
      message: "Incomplete POST body",
      requiredProperties: ["comment", "name"],
    });
  }

  //Construct a new comment object from the request data
  const newComment = new Comment(name, comment);
  //Push the new comment
  video.comments.push(newComment);
  //Write back the video list
  writeVideos(videos);
  //Return the new comment
  res.status(201).json(newComment);
}

/**
 * Deletes a comment. Returns the deleted comment.
 * @type {import("express").RequestHandler}
 */
function deleteComment(req, res) {
  const { videos, video } = req.routeData;
  const { id: commentId } = req.params;

  // Remove the comment from the list by splicing it out
  const removedComment = video.comments.splice(
    video.comments.findIndex((comment) => comment.id === commentId),
    1
  )[0];
  // Write back the video list
  writeVideos(videos);
  // Return the new comment
  res.json(removedComment);
}

module.exports = {
  postComment,
  deleteComment,
};
