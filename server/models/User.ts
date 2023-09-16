import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    required: true,
    unique: true,
  },
  friendsList: {
    type: [String],
    default: [],
  },
  friendRequests: {
    type: {
      sent: [String],
      received: [String],
    },
    default: {
      sent: [],
      received: [],
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
