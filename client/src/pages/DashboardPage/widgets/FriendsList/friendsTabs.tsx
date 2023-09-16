import { styled } from "styled-components";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import colors from "../../../../common/data/colors";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../../../setup/store/types/stateTypeDef";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../../../setup/context";
import { ResponsdeCodes } from "../../../../common/errorCodes";
import { useNavigate } from "react-router-dom";
import sortWordsAlphabetically from "../../../../common/utils/sortWordsAlphabetically";
import getEncryptString from "../../../../common/utils/getEncryptedString";

type TabTypes = "Friend requests" | "Sent requests" | "Received requests";
type FriendsDataType = {
  current: Array<string>;
  sent: Array<string>;
  received: Array<string>;
};

type props = {
  friendsData: FriendsDataType | undefined;
  setFriendsData: React.Dispatch<
    React.SetStateAction<FriendsDataType | undefined>
  >;
  getFriendsData: () => Promise<void>;
  handleFriendsDataSync: (receiverEmail: string) => void;
};

const FriendsTabs = ({
  friendsData,
  setFriendsData,
  getFriendsData,
  handleFriendsDataSync,
}: props) => {
  const [selectedTab, setSelectedTab] = useState<TabTypes>("Friend requests");

  const handleFriendReqRemove = (email: string) => {
    if (!friendsData) return;
    const updatedReceivedList = friendsData.received.filter(
      (emailItem) => emailItem !== email
    );
    setFriendsData((currentData) => {
      if (!currentData) return;
      return {
        ...currentData,
        received: updatedReceivedList,
      };
    });
    handleFriendsDataSync(email);
  };

  useEffect(() => {
    (async () => await getFriendsData())(); //IIFE
  }, [selectedTab]);

  return (
    <Wrapper>
      <Tabs>
        <TabIcon
          icon={SupervisorAccountIcon}
          title="Friend requests"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <TabIcon
          icon={ArrowUpwardIcon}
          title="Sent requests"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <TabIcon
          icon={ArrowDownwardIcon}
          title="Received requests"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </Tabs>
      <List>
        {(selectedTab === "Friend requests" &&
          friendsData?.current.map((friend, index) => (
            <FriendItem
              title={friend}
              key={index}
              acceptable={false}
              handleFriendReqRemove={handleFriendReqRemove}
              clickable={true}
            />
          ))) ||
          (selectedTab === "Received requests" &&
            friendsData?.received.map((req, index) => (
              <FriendItem
                title={req}
                key={index}
                acceptable={true}
                handleFriendReqRemove={handleFriendReqRemove}
                clickable={false}
              />
            ))) ||
          (selectedTab === "Sent requests" &&
            friendsData?.sent.map((req, index) => (
              <FriendItem
                title={req}
                key={index}
                acceptable={false}
                handleFriendReqRemove={handleFriendReqRemove}
                clickable={false}
              />
            )))}
      </List>
    </Wrapper>
  );
};

type TabIconProps = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  title: TabTypes;
  selectedTab: TabTypes;
  setSelectedTab: React.Dispatch<React.SetStateAction<TabTypes>>;
};

const TabIcon = ({
  icon: Icon,
  title,
  selectedTab,
  setSelectedTab,
}: TabIconProps) => {
  return (
    <Tooltip
      title={<h2 style={{ fontWeight: 300, fontSize: ".9rem" }}>{title}</h2>}
      placement="top"
    >
      <Tab
        onClick={() => setSelectedTab(title)}
        style={{
          backgroundColor:
            selectedTab === title
              ? colors.__colors_font_sec
              : colors.__colors_bg_sec,
        }}
      >
        <Icon
          sx={{
            color: colors.__colors_accent_pr,
            fontSize: 24,
          }}
        />
      </Tab>
    </Tooltip>
  );
};

type FriendItemProps = {
  title: string;
  acceptable: boolean;
  clickable: boolean;
  handleFriendReqRemove?: (email: string) => void;
};

const FriendItem = ({
  title,
  acceptable,
  clickable,
  handleFriendReqRemove = () => {},
}: FriendItemProps) => {
  const [userName, setUserName] = useState("Loading...");
  const [userPicturePath, setUserPicturePath] = useState("none");

  const { setAlertState, userState } = useContext(AppContext);
  const navigate = useNavigate();

  const id = useSelector((state: StoreStateTypeDef) => state.sweeter_id);
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);

  const acceptRequest = async () => {
    const rawData = await fetch(`${uri}/user/acceptRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: id, email: title }),
    });
    const jsonData = await rawData.json();

    if (jsonData.status === ResponsdeCodes.MISSING_TOKEN) {
      setAlertState({
        messages: ["Essential token not found", "Re-login if problem persues."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_TOKEN) {
      setAlertState({
        messages: ["Invalid session token!", "Re-login if problem persues."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_RECEIVER) {
      setAlertState({
        messages: ["User that sent request was no longer found!"],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_USER) {
      setAlertState({
        messages: ["Internal error, Re-login if problem persues."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.ERROR) {
      setAlertState({
        messages: [
          "Internal server error! Restart the app if problem persues.",
        ],
      });
      return;
    }
  };

  const rejectRequest = async () => {
    const rawData = await fetch(`${uri}/user/rejectRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: id, email: title }),
    });
    const jsonData = await rawData.json();

    if (jsonData.status === ResponsdeCodes.MISSING_TOKEN) {
      setAlertState({
        messages: ["Essential token not found", "Re-login if problem persues."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_TOKEN) {
      setAlertState({
        messages: ["Invalid session token!", "Re-login if problem persues."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_RECEIVER) {
      setAlertState({
        messages: ["User that sent request was no longer found!"],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_USER) {
      setAlertState({
        messages: ["Internal error, Re-login if problem persues."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.ERROR) {
      setAlertState({
        messages: [
          "Internal server error! Restart the app if problem persues.",
        ],
      });
      return;
    }
  };

  const handleClick = async () => {
    if (!clickable) return;

    const arrangedEmails = sortWordsAlphabetically([title, userState.email]);
    const unEncryptedDmPath = `${arrangedEmails[0]}+${arrangedEmails[1]}`;
    const encryptedDmPath = getEncryptString(unEncryptedDmPath);

    navigate(`/app/dms/${encryptedDmPath}`);
  };

  useEffect(() => {
    const getUserDataByEmail = async () => {
      const rawData = await fetch(`${uri}/user/getUserByEmail/${title}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonData = await rawData.json();

      if (jsonData.status === ResponsdeCodes.ERROR) {
        setUserName("Couldn't load");
        setUserPicturePath("none");
        return;
      } else if (jsonData.status === ResponsdeCodes.SUCCESS) {
        const { name, picturePath } = jsonData.userData;

        setUserName(name);
        setUserPicturePath(picturePath);
      }
    };

    (async () => await getUserDataByEmail())(); //IIFE
  }, []);

  return (
    <FriendItemWrapper
      style={{
        cursor: clickable ? "pointer" : "auto",
      }}
      onClick={handleClick}
    >
      <div className="info">
        <img
          src={`${uri}/assets/${title}-user-profile-${userPicturePath}`}
          alt="X"
        />
        <div className="credentials">
          <h2>{userName}</h2>
          <h3>{title}</h3>
        </div>
      </div>
      <div
        className="button_group"
        style={{ display: acceptable ? "flex" : "none" }}
      >
        <button
          onClick={() => {
            acceptRequest();
            handleFriendReqRemove(title);
          }}
        >
          <DoneIcon sx={{ color: colors.__colors_bg_sec }} />
        </button>
        <button
          onClick={() => {
            rejectRequest();
            handleFriendReqRemove(title);
          }}
        >
          <CloseIcon sx={{ color: colors.__colors_bg_sec }} />
        </button>
      </div>
    </FriendItemWrapper>
  );
};

export default FriendsTabs;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Tabs = styled.div`
  height: 2rem;
  display: flex;
`;

const Tab = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--colors-bg-sec);
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--colors-font-sec);
  }
`;

const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;

const FriendItemWrapper = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.4);
  width: 95%;
  margin-inline: auto;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  .info {
    display: flex;

    img {
      width: 40px;
      height: 40px;
      border-radius: 100px;
      object-fit: cover;
    }

    .credentials {
      margin-left: 5px;

      h2 {
        font-weight: 300;
        font-size: 0.9rem;
      }
      h3 {
        font-weight: 300;
        font-size: 0.7rem;
        margin-top: -5px;
      }
    }
  }

  .button_group {
    margin-left: auto;

    button {
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 5px;
      background: var(--colors-accent-pr);
      width: 50px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
`;
