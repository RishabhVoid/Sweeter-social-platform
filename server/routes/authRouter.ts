import { Router } from "express";
import { login, tokenVerify } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/tokenVerify", tokenVerify);

export default authRouter;
