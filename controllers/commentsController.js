const { v4 } = require("uuid");
const { read: readVideos, write: writeVideos } = require("./videosController");

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

function postComment(req, res) {
  const videoId = req.videoId;
  const { name, comment } = req.body;
  //Construct a new comment object from the request data
  const newComment = new Comment(name, comment);
  //Get the video list
  const videoList = readVideos();
  //Get the target video and push the comment to it's list
  const video = videoList.find((vid) => vid.id === videoId);
  if (!video) {
    res.sendStatus(500);
    return;
  }
  //Push the new comment
  video.comments.push(newComment);
  //Write back the video list
  writeVideos(videoList);
  //Return the new comment
  res.json(newComment);
}

function deleteComment(req, res) {
  const videoId = req.videoId;
  const { id: commentId } = req.body;

  //Get the video list
  const videoList = readVideos();
  //Get the target video and push the comment to it's list
  const video = videoList.find((vid) => vid.id === videoId);
  if (!video) {
    res.sendStatus(500);
    return;
  }
  ///Remove the comment from the list by splicing it out
  const removedComment = video.comments.splice(
    video.comments.findIndex((comment) => comment.id !== commentId),
    1
  )[0];
  //Write back the video list
  writeVideos(videoList);
  //Return the new comment
  res.json(removedComment);
}

module.exports = { postComment, deleteComment };
