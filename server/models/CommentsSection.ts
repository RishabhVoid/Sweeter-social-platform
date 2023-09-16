import mongoose from "mongoose";

const commentsSectionSchema = new mongoose.Schema({
  liquid: {
    type: [
      {
        commenterName: {
          type: String,
          required: true,
        },
        commenterEmail: {
          type: String,
          required: true,
        },
        commenterPicturePath: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
});

const CommentsSection = mongoose.model(
  "CommentsSection",
  commentsSectionSchema
);

export default CommentsSection;
