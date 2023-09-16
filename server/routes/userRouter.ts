import { Router } from "express";
import {
  acceptRequest,
  getDmMessages,
  getFriendsData,
  getUserByEmail,
  getUserData,
  postDmMessage,
  rejectRequest,
  removeFriend,
  sendRequest,
} from "../controllers/user";
import verifyToken from "../middlewares/verifyToken";

const userRouter = Router();

userRouter.get("/getUserData/:userId", verifyToken, getUserData);
userRouter.get("/getFriendsData/:userId", verifyToken, getFriendsData);
userRouter.get("/getUserByEmail/:email", verifyToken, getUserByEmail);
userRouter.get(
  "/getDmMessages/:tunnelRequestQuery",
  verifyToken,
  getDmMessages
);
userRouter.post("/sendRequest", verifyToken, sendRequest);
userRouter.post("/acceptRequest", verifyToken, acceptRequest);
userRouter.post("/rejectRequest", verifyToken, rejectRequest);
userRouter.post("/postDmMessage", verifyToken, postDmMessage);
userRouter.post("/removeFriend", verifyToken, removeFriend);

export default userRouter;
