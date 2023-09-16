import { Request, Response } from "express";
import { ResponsdeCodes } from "../errorCodes";
import Post from "../models/Post";
import CommentsSection from "../models/CommentsSection";
import mongoose from "mongoose";

export const postSinglePost = async (req: Request, res: Response) => {
  const { posterName, posterEmail, desc, picturePath, customFileName } =
    req.body;

  try {
    const finalPicturePath = "post-picture-" + customFileName + picturePath;
    const newCommentSection = new CommentsSection({
      liquid: [],
    });
    await newCommentSection.save();
    const commentsId = newCommentSection._id;

    const newPost = new Post({
      posterName,
      posterEmail,
      desc,
      commentsId,
      picturePath: finalPicturePath,
    });

    await newPost.save();
    const data = {
      status: ResponsdeCodes.SUCCESS,
      data: newPost,
    };
    return res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const postRequestForPosts = async (req: Request, res: Response) => {
  const { loadedPostIds } = req.body;

  const listOfExistingPosts = loadedPostIds as Array<string>;

  try {
    const posts = await Post.aggregate([
      {
        $match: {
          _id: {
            $nin: listOfExistingPosts.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
      { $sample: { size: 10 } },
    ]);

    posts.map((post) => listOfExistingPosts.push(post._id));

    if (posts.length === 0) {
      const data = {
        status: ResponsdeCodes.SUCCESS,
        data: {
          listOfPostIds: listOfExistingPosts,
          posts: [],
        },
      };
      res.status(200).json(data);
    } else {
      const data = {
        status: ResponsdeCodes.SUCCESS,
        data: {
          listOfPostIds: listOfExistingPosts,
          posts,
        },
      };
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { postId, userEmail } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error("invalid_document");

    if (post.likes.includes(userEmail)) {
      post.likes = post.likes.filter((email) => email !== userEmail);
    } else {
      post.likes.push(userEmail);
    }
    await post.save();
    const data = {
      status: ResponsdeCodes.SUCCESS,
    };
    return res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const addComment = async (req: Request, res: Response) => {
  const {
    commentId,
    commenterName,
    comment,
    commenterEmail,
    commenterPicturePath,
  } = req.body;

  try {
    const commentSection = await CommentsSection.findById(commentId);
    if (!commentSection) throw new Error("Internal Server Error");
    commentSection.liquid.push({
      comment,
      commenterPicturePath,
      commenterEmail,
      commenterName,
    });
    await commentSection.save();
    const data = {
      status: ResponsdeCodes.SUCCESS,
    };
    return res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const getCommentsSize = async (req: Request, res: Response) => {
  const commentsId = req.params.commentsId;

  try {
    const commentSection = await CommentsSection.findById(commentsId);
    if (!commentSection) throw new Error("Internal Server Error");
    const data = {
      status: ResponsdeCodes.SUCCESS,
      data: commentSection.liquid.length,
    };
    return res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};

export const getComments = async (req: Request, res: Response) => {
  const commentsId = req.params.commentsId;

  try {
    const commentSection = await CommentsSection.findById(commentsId);
    if (!commentSection) throw new Error("Internal Server Error");
    const data = {
      status: ResponsdeCodes.SUCCESS,
      data: commentSection.liquid,
    };
    return res.status(201).json(data);
  } catch {
    const data = {
      status: ResponsdeCodes.ERROR,
    };
    res.status(500).json(data);
  }
};
