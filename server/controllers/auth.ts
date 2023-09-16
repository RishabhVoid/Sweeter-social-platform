import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { ResponsdeCodes, ServerErrorCodes } from "../errorCodes";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };

      return res.status(403).json(data);
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!doesPasswordMatch) {
      const data = {
        status: ResponsdeCodes.INVALID_CEDENTIALS,
      };

      return res.status(401).json(data);
    }

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) throw new Error(ServerErrorCodes.ENV_ERROR);

    const token = jwt.sign(
      {
        id: user._id,
        email: email,
      },
      tokenSecret
    );

    const data = {
      userId: user._id,
      token: token,
    };

    res.status(200).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };

    return res.status(500).json(data);
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, picturePath } = req.body;

  const passwordSalt = await bcrypt.genSalt(10);

  const passwordHash = await bcrypt.hash(password, passwordSalt);

  try {
    const newUser = new User({
      name,
      email,
      picturePath,
      passwordHash,
    });

    const savedUser = await newUser.save();
    const userId = savedUser._id;

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) throw new Error(ServerErrorCodes.ENV_ERROR);

    const token = jwt.sign(
      {
        id: userId,
        email: email,
      },
      tokenSecret
    );

    const data = {
      token,
      userId,
    };

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const tokenVerify = (req: Request, res: Response) => {
  const { token } = req.body;

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

    const data = {
      status: ResponsdeCodes.VALID_TOKEN,
    };

    res.status(200).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };

    res.status(500).json(data);
  }
};
