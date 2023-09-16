import { Request, Response } from "express";
import { ResponsdeCodes } from "../errorCodes";

export const checkUri = (req: Request, res: Response) => {
  res.status(200).json({
    status: ResponsdeCodes.SUCCESS,
  });
};
