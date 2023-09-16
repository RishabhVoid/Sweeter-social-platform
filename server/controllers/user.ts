import { Request, Response } from "express";
import User from "../models/User";
import { ResponsdeCodes } from "../errorCodes";
import Tunnel from "../models/Tunnel";
import { allowedBucketSize } from "../constants";

export const getUserData = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) return;

    const updatedUser = {
      name: user.name,
      email: user.email,
      picturePath: user.picturePath,
      friendsList: user.friendsList,
    };

    res.status(200).json(updatedUser);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };

    res.status(500).json(data);
  }
};

export const getFriendsData = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };
      res.status(401).json(data);
      return;
    }

    const current = user.friendsList;
    const sent = user.friendRequests.sent;
    const received = user.friendRequests.received;

    const friendsData = {
      current,
      sent,
      received,
    };

    const data = {
      status: ResponsdeCodes.SUCCESS,
      friendsData,
    };

    res.status(200).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };
      return res.status(401).json(data);
    }

    const data = {
      status: ResponsdeCodes.SUCCESS,
      userData: {
        name: user.name,
        picturePath: user.picturePath,
      },
    };

    return res.status(200).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const sendRequest = async (req: Request, res: Response) => {
  const { id, receiverEmail } = req.body;

  try {
    const sender = await User.findById(id);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };
      res.status(401).json(data);
      return;
    } else if (!receiver) {
      const data = {
        status: ResponsdeCodes.INVALID_RECEIVER,
      };
      res.status(401).json(data);
      return;
    }

    if (sender.friendRequests.sent.includes(receiverEmail)) {
      const data = {
        status: ResponsdeCodes.RESULT_PRE_MET,
      };

      res.status(401).json(data);
      return;
    }

    sender.friendRequests.sent = [...sender.friendRequests.sent, receiverEmail];
    await sender.save();

    receiver.friendRequests.received = [
      ...receiver.friendRequests.received,
      sender.email,
    ];
    await receiver.save();

    const data = {
      status: ResponsdeCodes.SUCCESS,
    };

    res.status(200).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(200).json(data);
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  const { userId, email } = req.body;

  try {
    const sender = await User.findOne({ email: email });
    const accepter = await User.findById(userId);

    if (!sender) {
      const data = {
        status: ResponsdeCodes.INVALID_RECEIVER,
      };
      res.status(401).json(data);
      return;
    } else if (!accepter) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };
      res.status(401).json(data);
      return;
    }

    const friendsListSender = sender.friendsList;
    const sentListSender = sender.friendRequests.sent;
    const updatedSentListSender = sentListSender.filter(
      (email) => email !== accepter.email
    );
    if (!sender.friendsList.includes(accepter.email)) {
      sender.friendsList = [...friendsListSender, accepter.email];
    }
    sender.friendRequests.sent = updatedSentListSender;
    await sender.save();

    const friendsListAccepter = accepter.friendsList;
    const receivedListAccepter = accepter.friendRequests.received;
    const updatedReceivedListAccepter = receivedListAccepter.filter(
      (email) => email !== sender.email
    );
    if (!accepter.friendsList.includes(sender.email)) {
      accepter.friendsList = [...friendsListAccepter, sender.email];
    }
    accepter.friendRequests.received = updatedReceivedListAccepter;
    await accepter.save();
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  const { userId, email } = req.body;

  try {
    const sender = await User.findOne({ email: email });
    const accepter = await User.findById(userId);

    if (!sender) {
      const data = {
        status: ResponsdeCodes.INVALID_RECEIVER,
      };
      res.status(401).json(data);
      return;
    } else if (!accepter) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };
      res.status(401).json(data);
      return;
    }

    const sentListSender = sender.friendRequests.sent;
    const updatedSentListSender = sentListSender.filter(
      (email) => email !== accepter.email
    );
    sender.friendRequests.sent = updatedSentListSender;
    await sender.save();

    const receivedListAccepter = accepter.friendRequests.received;
    const updatedReceivedListAccepter = receivedListAccepter.filter(
      (email) => email !== sender.email
    );
    accepter.friendRequests.received = updatedReceivedListAccepter;
    await accepter.save();
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const postDmMessage = async (req: Request, res: Response) => {
  const { tunnelId, senderEmail, textMessage, timeStamp } = req.body;

  const message = {
    senderEmail,
    textMessage,
    timeStamp,
  };

  try {
    const requestedTunnel = await Tunnel.findById(tunnelId);

    if (!requestedTunnel) {
      const newTunnel = new Tunnel({
        _id: tunnelId,
        buckets: [
          {
            timePeriod: {
              start: timeStamp,
              end: timeStamp,
            },
            liquid: [message],
          },
        ],
      });
      await newTunnel.save();

      const data = {
        status: ResponsdeCodes.SUCCESS,
      };

      return res.status(201).json(data);
    }

    const buckets = requestedTunnel.buckets;
    const lastBucket = buckets.reverse()[0];
    const isLastBucketFull = lastBucket.liquid.length + 1 > allowedBucketSize;

    if (isLastBucketFull) {
      const newBucket = {
        timePeriod: {
          start: timeStamp,
          end: timeStamp,
        },
        liquid: [message],
      };
      buckets.push(newBucket);
      requestedTunnel.buckets = buckets;
      await requestedTunnel.save();

      const data = {
        status: ResponsdeCodes.SUCCESS,
      };
      return res.status(200).json(data);
    }

    if (!lastBucket.timePeriod || !lastBucket.liquid)
      throw new Error("bucket_not_found");

    lastBucket.timePeriod.end = timeStamp;
    lastBucket.liquid.push(message);
    buckets[buckets.length - 1] = lastBucket;
    requestedTunnel.buckets = buckets;
    await requestedTunnel.save();

    const data = {
      status: ResponsdeCodes.SUCCESS,
    };

    res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const getDmMessages = async (req: Request, res: Response) => {
  const tunnelRequestQuery = req.params.tunnelRequestQuery;
  const querySaperator = "_";
  const tunnelId = tunnelRequestQuery.split(querySaperator)[0];
  const requestedBucketNo = parseInt(
    tunnelRequestQuery.split(querySaperator)[1]
  );

  try {
    const requestedTunnel = await Tunnel.findOne({ _id: tunnelId });

    if (!requestedTunnel) {
      const data = {
        status: ResponsdeCodes.SUCCESS,
        data: [
          {
            textMessage: "Send a message now! Start a convo!",
            timeStamp: "0-0-0-0-0",
            senderEmail: "system@gmail.com",
          },
        ],
      };
      return res.status(200).json(data);
    } else if (requestedBucketNo === -1) {
      if (requestedTunnel.buckets.length <= 1) {
        const liquidPool = requestedTunnel.buckets.reverse()[0];
        const data = {
          status: ResponsdeCodes.SUCCESS,
          data: liquidPool.liquid,
        };
        return res.status(200).json(data);
      }

      const reversedBuckets = requestedTunnel.buckets.reverse();

      const lastestPoolSize = reversedBuckets[0].liquid.length;
      const prevToLatestPool = reversedBuckets[1].liquid.splice(
        lastestPoolSize,
        50
      );
      const liquidatedPool = [
        ...prevToLatestPool,
        ...reversedBuckets[0].liquid,
      ];
      const data = {
        status: ResponsdeCodes.SUCCESS,
        data: liquidatedPool,
      };
      return res.status(200).json(data);
    }

    if (requestedBucketNo > requestedTunnel.buckets.length - 1) {
      const data = {
        status: ResponsdeCodes.INVALID_CEDENTIALS,
      };
      return res.status(403).json(data);
    }

    const requestedLiquidPool =
      requestedTunnel.buckets[requestedBucketNo].liquid;
    const data = {
      status: ResponsdeCodes.SUCCESS,
      data: requestedLiquidPool,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  const { userId, friendEmail, tunnelId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const data = {
        status: ResponsdeCodes.INVALID_USER,
      };
      return res.status(404).json(data);
    }

    const updatedUserFriendList = user.friendsList.filter(
      (email) => email !== friendEmail
    );
    user.friendsList = updatedUserFriendList;
    await user.save();

    await Tunnel.deleteOne({ _id: tunnelId });

    const data = {
      status: ResponsdeCodes.SUCCESS,
    };
    res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};
