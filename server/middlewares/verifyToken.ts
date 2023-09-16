import { NextFunction, Request, Response } from "express";
import { ResponsdeCodes, ServerErrorCodes } from "../errorCodes";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken && typeof authToken !== "string") {
    const data = {
      status: ResponsdeCodes.MISSING_TOKEN,
    };

    return res.status(401).json(data);
  }

  const token = authToken.slice(7);

  try {
    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) throw new Error(ServerErrorCodes.ENV_ERROR);

    const decodedData = jwt.verify(token, tokenSecret);

    if (!decodedData) {
      const data = {
        status: ResponsdeCodes.INVALID_TOKEN,
      };
      res.status(403).json(data);
      return;
    }

    next();
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };

    res.status(500).json(data);
  }
};

export default verifyToken;
