import { styled } from "styled-components";
import { FormEvent, useEffect, useRef, useState } from "react";
import CustomButton from "../../../../common/components/CustomButton";
import isValidEmail from "../../../../common/utils/isValidEmail";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../../../setup/store/types/stateTypeDef";
import FriendsTabs from "./friendsTabs";
import { ResponsdeCodes } from "../../../../common/errorCodes";
import { AppContext } from "../../../../setup/context";
import { useContext } from "react";
import { Socket } from "socket.io-client";

type FriendsDataType = {
  current: Array<string>;
  sent: Array<string>;
  received: Array<string>;
};

type props = {
  socketConnector: Socket;
};

const FriendsList = ({ socketConnector }: props) => {
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const userId = useSelector((state: StoreStateTypeDef) => state.sweeter_id);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { setAlertState, userState } = useContext(AppContext);

  const [friendsData, setFriendsData] = useState<FriendsDataType>();
  const [log, setLog] = useState("");

  const changeLog = (log: string) => {
    setLog(log);
    setTimeout(() => {
      setLog("");
    }, 1500);
  };

  const handleFriendsDataSync = (receiverEmail: string) => {
    socketConnector.emit("send_req_for_perm_to_sync_friends", {
      userEmail: userState.email,
      receiverEmail: receiverEmail,
    });
  };

  const getFriendsData = async () => {
    const rawData = await fetch(`${uri}/user/getFriendsData/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const jsonData = await rawData.json();

    if (
      jsonData.status === ResponsdeCodes.MISSING_TOKEN ||
      jsonData.status === ResponsdeCodes.INVALID_TOKEN
    ) {
      setFriendsData({
        current: ["Invalid token, re-login..."],
        sent: ["Invalid token, re-login..."],
        received: ["Invalid token, re-login..."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.ERROR) {
      setFriendsData({
        current: ["Error loading..."],
        sent: ["Error loading..."],
        received: ["Error loading..."],
      });
      return;
    } else if (jsonData.status === ResponsdeCodes.SUCCESS) {
      setFriendsData(jsonData.friendsData as FriendsDataType);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputRef.current) return;

    const inputValue = inputRef.current.value;

    if (!isValidEmail(inputValue)) {
      changeLog("Invalid email!");
      return;
    }

    const rawData = await fetch(`${uri}/user/sendRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId, receiverEmail: inputValue }),
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
    } else if (jsonData.status === ResponsdeCodes.INVALID_USER) {
      changeLog("Internal error! Re-log in if problem persues.");
      return;
    } else if (jsonData.status === ResponsdeCodes.INVALID_RECEIVER) {
      changeLog("User not found!");
      return;
    } else if (jsonData.status === ResponsdeCodes.SUCCESS) {
      changeLog("Request sent!");
      inputRef.current.value = "";
      handleFriendsDataSync(inputValue);
      return;
    } else if (jsonData.status === ResponsdeCodes.ERROR) {
      changeLog("Internal server error! reload app if problem persues.");
      return;
    } else if (jsonData.status === ResponsdeCodes.RESULT_PRE_MET) {
      changeLog("Request already exists.");
      inputRef.current.value = "";
      return;
    }
  };

  useEffect(() => {
    socketConnector.on("sync_friends_data", () => {
      getFriendsData();
    });
  }, []);

  return (
    <Wrapper>
      <FriendsAdder onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type email here to add friend..."
          ref={inputRef}
        />
        <h3
          style={{
            padding: log.length ? "5px" : "0px",
          }}
        >
          {log}
        </h3>
        <CustomButton title="Add +" type="submit" stopBopping={true} />
      </FriendsAdder>
      <FriendsTabs
        getFriendsData={getFriendsData}
        friendsData={friendsData}
        setFriendsData={setFriendsData}
        handleFriendsDataSync={handleFriendsDataSync}
      />
    </Wrapper>
  );
};

export default FriendsList;

const Wrapper = styled.div`
  width: 14rem;
  height: 100%;
  border-right: 1px solid var(--colors-bg-sec);
  display: flex;
  flex-direction: column;
`;

const FriendsAdder = styled.form`
  input {
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--colors-bg-sec);
    font-size: 0.9rem;
    padding: 10px 5px;

    &:focus {
      outline: none;
    }
  }

  button {
    margin-top: 0.5rem;
    border-radius: 0px;
    width: 100%;
  }

  h3 {
    overflow: hidden;
    background-color: #ff8181;
    font-weight: 300;
    font-size: 0.8rem;
    color: var(--colors-bg-pr);
  }
`;
