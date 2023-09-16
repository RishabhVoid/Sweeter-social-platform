import express from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import checkRouter from "./routes/checkRouter";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import { register } from "./controllers/auth";
import checkExistingUser from "./middlewares/checkExistingUser";
import http from "http";
import { Server } from "socket.io";
import postsRouter from "./routes/postsRouter";
import verifyToken from "./middlewares/verifyToken";
import { postSinglePost } from "./controllers/posts";

const hostingPort = 3001;
const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
dotenv.config();

const io = new Server(httpServer, {
  cors: {
    origin: "https://sweeter-silenxika.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Socket Io events
io.on("connection", (socket) => {
  socket.on("dashboard_room_join", (data) => {
    const userEmail = data.email;
    const roomName = `dashboard_room_${userEmail}`;
    socket.join(roomName);
  });

  socket.on("send_req_for_perm_to_sync_friends", (data) => {
    const userEmail = data.userEmail;
    const receiverEmail = data.receiverEmail;

    socket
      .to(`dashboard_room_${userEmail}`)
      .to(`dashboard_room_${receiverEmail}`)
      .emit("sync_friends_data");
  });

  socket.on("dm_room_join", (data) => {
    const roomId = data.dmId;
    socket.join(roomId);
  });

  socket.on("new_dm_message", (data) => {
    const roomId = data.dmId;
    const message = {
      textMessage: data.textMessage,
      senderEmail: data.senderEmail,
      timeStamp: data.timeStamp,
    };
    socket.to(roomId).emit("sync_dm_messages", {
      message,
    });
  });
});

app.use("/assets", express.static("public"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    if (req.body.isPost === "1") {
      cb(null, "post-picture-" + req.body.customFileName + file.originalname);
      return;
    }
    cb(null, req.body.email + "-user-profile-" + file.originalname);
  },
});

const uploadMiddleWare = multer({ storage: storage });

app.use("/check", checkRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/posts", postsRouter);

app.post(
  "/auth/register",
  checkExistingUser,
  uploadMiddleWare.single("picture"),
  register
);

app.post(
  "/posts/postSinglePost",
  verifyToken,
  uploadMiddleWare.single("postPicture"),
  postSinglePost
);

mongoose.connect("mongodb://127.0.0.1:27017/SweeterDB").then(() => {
  httpServer.listen(hostingPort, () => {
    console.log(`Listening on the port ${hostingPort}`);
  });
});
