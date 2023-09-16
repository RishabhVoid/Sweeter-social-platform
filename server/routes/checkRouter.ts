import { Router } from "express";
import { checkUri } from "../controllers/check";

const checkRouter = Router();

checkRouter.get("/uri", checkUri);

export default checkRouter;
