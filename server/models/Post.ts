import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  posterName: {
    type: String,
    required: true,
  },
  posterEmail: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: "",
  },
  picturePath: {
    type: String,
    default: "",
  },
  commentsId: {
    type: String,
    required: true,
  },
  likes: {
    type: [String],
    required: true,
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
