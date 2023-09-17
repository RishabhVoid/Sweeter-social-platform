import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import DmSidebar from "./Sidebar";
import getDecryptedString from "../../common/utils/getDecryptedString";
import { AppContext } from "../../setup/context";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../setup/store/types/stateTypeDef";
import { ResponsdeCodes } from "../../common/errorCodes";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import { connect } from "socket.io-client";
import DmHeader from "./Header";

type FriendDataType = {
  name: String;
  email: String;
  picturePath: String;
};

const DmPage = () => {
  const [friendData, setFriendData] = useState<FriendDataType>({
    name: "",
    email: "",
    picturePath: "",
  });
  const [isHistoryChecking, setIsHistoryChecking] = useState(false);
  const [bucketNo, setBucketNo] = useState(0);

  const { email } = useParams();
  const { setUserState, setAlertState, userState } = useContext(AppContext);

  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);
  const id = useSelector((state: StoreStateTypeDef) => state.sweeter_id);

  const socket = connect(uri);

  const getFriendData = async () => {
    if (!email) return;
    const decryptedEmailString = getDecryptedString(email);
    const friendEmail = decryptedEmailString
      .split("+")
      .filter((email) => email !== userState.email)[0];

    const rawData = await fetch(`${uri}/user/getUserByEmail/${friendEmail}`, {
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

    setFriendData({
      name: jsonData.userData.name,
      email: friendEmail,
      picturePath: jsonData.userData.picturePath,
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
  };

  useEffect(() => {
    (async () => await getUserData())();
  }, []);

  useEffect(() => {
    if (!userState.name) return;
    (async () => await getFriendData())();
  }, [userState.name]);

  useEffect(() => {
    if (!email) return;
    socket.emit("dm_room_join", {
      dmId: email,
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!friendData.name.trim()) return;
    document.title = `Dm @${friendData.name}`;
  }, [friendData.name]);

  return (
    <Wrapper>
      <DmSidebar
        friendName={friendData.name}
        friendEmail={friendData.email}
        friendPicturePath={friendData.picturePath}
        tunnelId={email}
        setIsHistoryChecking={setIsHistoryChecking}
        isHistoryChecking={isHistoryChecking}
      />
      <ChatBoxWrapper>
        {isHistoryChecking && (
          <DmHeader bucketNo={bucketNo} setBucketNo={setBucketNo} />
        )}
        <ChatBox
          dmId={email}
          socketConnector={socket}
          isHistoryChecking={isHistoryChecking}
          bucketNo={bucketNo}
        />
        {!isHistoryChecking && (
          <ChatInput dmId={email} socketConnector={socket} />
        )}
      </ChatBoxWrapper>
    </Wrapper>
  );
};

export default DmPage;

const Wrapper = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
`;

const ChatBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  position: relative;
`;
