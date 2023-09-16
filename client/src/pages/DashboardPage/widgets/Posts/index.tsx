import { useSelector } from "react-redux";
import { styled } from "styled-components";
import StoreStateTypeDef from "../../../../setup/store/types/stateTypeDef";
import { ResponsdeCodes } from "../../../../common/errorCodes";
import { useContext, useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { AppContext } from "../../../../setup/context";
import colors from "../../../../common/data/colors";
import CustomButton from "../../../../common/components/CustomButton";

type PostsType = {
  _id: string;
  posterName: string;
  posterEmail: string;
  desc: string;
  picturePath: string;
  commentsId: string;
  likes: Array<String>;
};

type props = {
  posts: Array<PostsType>;
  postsExhausted: boolean;
  updateLikedPosts: (postId: String, userEmail: string) => void;
  loadPosts: () => Promise<void>;
  setSelectedCommentsId: React.Dispatch<React.SetStateAction<string>>;
};

const Posts = ({
  posts,
  postsExhausted,
  updateLikedPosts,
  loadPosts,
  setSelectedCommentsId,
}: props) => {
  const { userState } = useContext(AppContext);

  return (
    <Wrapper>
      <PostsList>
        {posts.map((post, index) => {
          const hasUserLikedPost = post.likes.includes(userState.email);
          return (
            <PostComponent
              hasUserLikedPost={hasUserLikedPost}
              post={post}
              key={index}
              updateLikedPosts={updateLikedPosts}
              setSelectedCommentsId={setSelectedCommentsId}
            />
          );
        })}
        <CustomButton
          title={postsExhausted ? "Oops! no more posts found!" : "Load more..."}
          disabled={postsExhausted}
          callback={loadPosts}
        />
      </PostsList>
    </Wrapper>
  );
};

export default Posts;

type postComponentsProps = {
  post: PostsType;
  updateLikedPosts: (postId: String, userEmail: string) => void;
  hasUserLikedPost: boolean;
  setSelectedCommentsId: React.Dispatch<React.SetStateAction<string>>;
};

const PostComponent = ({
  post,
  updateLikedPosts,
  hasUserLikedPost,
  setSelectedCommentsId,
}: postComponentsProps) => {
  const [posterPicturePath, setPosterPicturePath] = useState("");
  const [commentsSize, setCommentsSize] = useState(0);

  const { setAlertState, userState } = useContext(AppContext);

  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);

  const getCommentsSize = async () => {
    const rawData = await fetch(
      `${uri}/posts/getCommentsSize/${post.commentsId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await rawData.json();

    if (jsonData.status === ResponsdeCodes.ERROR) {
      //pass
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_TOKEN) {
      setAlertState({
        messages: [
          "Invalid token!",
          "Log out and log back in given the problem persues.",
        ],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.MISSING_TOKEN) {
      setAlertState({
        messages: [
          "Essential token missing!",
          "Log out and log back in given the problem persues.",
        ],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.SUCCESS) {
      setCommentsSize(jsonData.data as number);
    }
  };

  const likePost = async () => {
    const rawData = await fetch(`${uri}/posts/likePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: post._id, userEmail: userState.email }),
    });
    const jsonData = await rawData.json();
    if (jsonData.status === ResponsdeCodes.INVALID_TOKEN) {
      setAlertState({
        messages: [
          "Invalid token!",
          "Log out and log back in given the problem persues.",
        ],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.MISSING_TOKEN) {
      setAlertState({
        messages: [
          "Essential token missing!",
          "Log out and log back in given the problem persues.",
        ],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.SUCCESS) {
      updateLikedPosts(post._id, userState.email);
    }
  };

  const selectCommentSection = () => {
    setSelectedCommentsId(post.commentsId);
  };

  useEffect(() => {
    const getUserDataByEmail = async () => {
      const rawData = await fetch(
        `${uri}/user/getUserByEmail/${post.posterEmail}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await rawData.json();

      if (jsonData.status === ResponsdeCodes.SUCCESS) {
        const { picturePath } = jsonData.userData;

        setPosterPicturePath(picturePath);
      }
    };

    (async () => await getUserDataByEmail())(); //IIFE
    (async () => await getCommentsSize())(); //IIFE
  }, []);

  return (
    <Post>
      <PosterInfo>
        <img
          src={`${uri}/assets/${post.posterEmail}-user-profile-${posterPicturePath}`}
          alt="X"
        />
        <span>
          <h2>{post.posterName}</h2>
          <h3>{post.posterEmail}</h3>
        </span>

        <PostOptions>
          <span className="likes_counter">{post.likes.length}</span>
          <FavoriteIcon
            onClick={likePost}
            sx={{
              color: hasUserLikedPost ? "red" : colors.__colors_font_sec,
            }}
          />
          <span className="comments_counter">{commentsSize}</span>
          <ChatBubbleIcon onClick={selectCommentSection} />
        </PostOptions>
      </PosterInfo>
      <PosterImage>
        <span />
        <img src={`${uri}/assets/${post.picturePath}`} alt="post" />
      </PosterImage>
      <PostDesc>
        {post.desc.slice(0, 150)}
        {post.desc.length > 150 ? "..." : ""}
      </PostDesc>
    </Post>
  );
};

const Wrapper = styled.div`
  flex: 1;
  height: calc(100vh - 3rem);
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    background-color: var(--colors-accent-pr);
    border-radius: 10px;
  }
  &::-webkit-scrollbar {
    width: 8px;
    background-color: var(--colors-bg-sec);
  }
`;

const PostsList = styled.div`
  width: 30rem;
  margin-inline: auto;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;

  button {
    margin-inline: auto;
  }
`;

const Post = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--colors-bg-sec);
`;

const PosterInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  img {
    border-radius: 100px;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    object-fit: cover;
  }

  span {
    display: flex;
    flex-direction: column;

    h2 {
      font-size: 1rem;
      font-weight: 300;
    }

    h3 {
      font-size: 0.9rem;
      font-weight: 300;
      margin-top: -5px;
    }
  }
`;

const PosterImage = styled.div`
  position: relative;
  width: 30rem;
  height: 30rem;

  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: contain;
    position: relative;
    z-index: 20;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;
    background-color: var(--colors-font-sec);
  }
`;

const PostDesc = styled.p`
  margin: 5px 0px;
`;

const PostOptions = styled.div`
  margin-left: auto;
  position: relative;
  display: flex;
  align-items: center;

  .likes_counter,
  .comments_counter {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    width: 1rem;
    height: 1rem;
    font-size: 0.8rem;
  }

  .comments_counter {
    top: 1rem;
    right: 0;
    left: 1.2rem;
  }

  svg {
    margin-left: 5px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: 0.2s;

    &:last-child {
      color: var(--colors-accent-pr);
    }

    &:hover {
      transform: scale(1.1);
    }
  }
`;
