import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { ResponsdeCodes } from "../errorCodes";

const checkExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.headers.email;
  try {
    const matchingUser = await User.findOne({ email: email });
    if (!matchingUser) {
      next();
      return;
    }
    const data = {
      status: ResponsdeCodes.PRE_EXISTING_USER,
    };
    res.status(401).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export default checkExistingUser;
