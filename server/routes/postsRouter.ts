import { Router } from "express";
import {
  addComment,
  getComments,
  getCommentsSize,
  likePost,
  postRequestForPosts,
} from "../controllers/posts";
import verifyToken from "../middlewares/verifyToken";

const postsRouter = Router();

postsRouter.post("/postRequestForPosts", verifyToken, postRequestForPosts);
postsRouter.post("/likePost", verifyToken, likePost);
postsRouter.post("/addComment", verifyToken, addComment);
postsRouter.get("/getComments/:commentsId", verifyToken, getComments);
postsRouter.get("/getCommentsSize/:commentsId", verifyToken, getCommentsSize);

export default postsRouter;
