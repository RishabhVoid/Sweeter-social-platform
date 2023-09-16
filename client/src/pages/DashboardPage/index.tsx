import { useSelector } from "react-redux";
import { styled } from "styled-components";
import StoreStateTypeDef from "../../setup/store/types/stateTypeDef";
import { AppContext } from "../../setup/context";
import { useContext, useEffect, useState } from "react";
import DashboardHeader from "./widgets/Header";
import FriendsList from "./widgets/FriendsList";
import { ResponsdeCodes } from "../../common/errorCodes";
import { connect } from "socket.io-client";
import Posts from "./widgets/Posts";
import Sidebar from "./widgets/Sidebar";

type PostsType = {
  _id: string;
  posterName: string;
  posterEmail: string;
  desc: string;
  picturePath: string;
  commentsId: string;
  likes: Array<String>;
};

const DashboardPage = () => {
  const [existingPostIds, setExistingPostIds] = useState<Array<String>>([]);
  const [posts, setPosts] = useState<Array<PostsType>>([]);
  const [postsExhausted, setPostsExhausted] = useState(false);
  const [selectedCommentsId, setSelectedCommentsId] = useState("");

  const id = useSelector((state: StoreStateTypeDef) => state.sweeter_id);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);

  const socket = connect(uri);

  const { setAlertState, setUserState } = useContext(AppContext);

  const updateLikedPost = (postId: String, userEmail: string) => {
    setPosts((posts) => {
      const updatedPosts = posts.map((post) => {
        if (post._id !== postId) return post;

        if (post.likes.includes(userEmail)) {
          post.likes = post.likes.filter((email) => email !== userEmail);
        } else {
          post.likes.push(userEmail);
        }
        return post;
      });
      return updatedPosts;
    });
  };

  const getUserData = async () => {
    const rawData = await fetch(`${uri}/user/getUserData/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const jsonData = await rawData.json();

    if (jsonData.status === ResponsdeCodes.ERROR) {
      setAlertState({
        messages: [
          "Internal server error!",
          "Plese reload the app if problem persues.",
          "Log out and log back in given the problem persues.",
        ],
      });
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
    }

    setUserState({
      name: jsonData.name,
      email: jsonData.email,
      picturePath: jsonData.picturePath,
      friendsList: jsonData.friendsList,
    });

    socket.emit("dashboard_room_join", {
      email: jsonData.email,
    });
  };

  const getPosts = async () => {
    const rawData = await fetch(`${uri}/posts/postRequestForPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ loadedPostIds: existingPostIds }),
    });
    const jsonData = await rawData.json();
    if (jsonData.status === ResponsdeCodes.ERROR) {
      setAlertState({
        messages: [
          "Internal server error!",
          "Plese reload the app if problem persues.",
          "Log out and log back in given the problem persues.",
        ],
      });
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
    }

    if (jsonData.data.posts.length === 0) {
      setPostsExhausted(true);
    }

    setPosts((posts) => [
      ...posts,
      ...(jsonData.data.posts as Array<PostsType>),
    ]);
    setExistingPostIds(jsonData.data.listOfPostIds as Array<String>);
  };

  const addPost = (
    _id: string,
    posterName: string,
    posterEmail: string,
    desc: string,
    picturePath: string,
    commentsId: string,
    likes: Array<String>
  ) => {
    setPosts((posts) => [
      {
        _id,
        posterName,
        posterEmail,
        desc,
        picturePath,
        commentsId,
        likes,
      },
      ...posts,
    ]);
  };

  useEffect(() => {
    (async () => await getUserData())();
    (async () => await getPosts())();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Wrapper>
      <DashboardHeader />
      <ScreenWrapper>
        <FriendsList socketConnector={socket} />
        <Posts
          setSelectedCommentsId={setSelectedCommentsId}
          loadPosts={getPosts}
          posts={posts}
          postsExhausted={postsExhausted}
          updateLikedPosts={updateLikedPost}
        />
        <Sidebar
          selectedCommentsId={selectedCommentsId}
          setSelectedCommentsId={setSelectedCommentsId}
          addPost={addPost}
        />
      </ScreenWrapper>
    </Wrapper>
  );
};

export default DashboardPage;

const Wrapper = styled.div`
  overflow: hidden;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ScreenWrapper = styled.div`
  flex: 1;
  display: flex;
`;
