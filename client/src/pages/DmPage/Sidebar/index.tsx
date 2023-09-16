import { useSelector } from "react-redux";
import { styled } from "styled-components";
import StoreStateTypeDef from "../../../setup/store/types/stateTypeDef";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import RemoveCircleSharpIcon from "@mui/icons-material/RemoveCircleSharp";
import Tooltip from "@mui/material/Tooltip";
import React, { useContext } from "react";
import { AppContext } from "../../../setup/context";
import { ResponsdeCodes } from "../../../common/errorCodes";
import TimerIcon from "@mui/icons-material/Timer";
import colors from "../../../common/data/colors";

type props = {
  friendName: String;
  friendEmail: String;
  friendPicturePath: String;
  tunnelId: String | undefined;
  isHistoryChecking: boolean;
  setIsHistoryChecking: React.Dispatch<React.SetStateAction<boolean>>;
};

const DmSidebar = ({
  friendName,
  friendEmail,
  friendPicturePath,
  tunnelId,
  isHistoryChecking,
  setIsHistoryChecking,
}: props) => {
  const navigate = useNavigate();

  const { setChoicesState, setAlertState } = useContext(AppContext);

  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);
  const id = useSelector((state: StoreStateTypeDef) => state.sweeter_id);

  const goBack = () => {
    navigate(-1);
  };

  const postFriendRemoval = async () => {
    const rawData = await fetch(`${uri}/user/removeFriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: id,
        friendEmail,
        tunnelId,
      }),
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
    } else if (jsonData.status === ResponsdeCodes.INVALID_USER) {
      setAlertState({
        messages: [
          "Internal database error!",
          "Re-login if the given problem persues.",
        ],
      });
    } else if (jsonData.status === ResponsdeCodes.SUCCESS) {
      goBack();
    }
  };

  const removeFriend = () => {
    setChoicesState({
      choices: ["Yes", "No"],
      messages: [
        "Do you want to remove the friend?",
        "Dms would be deleted from both sides if done so.",
      ],
      callback(choice) {
        if (choice === "No") return;
        postFriendRemoval();
      },
    });
  };

  return (
    <Wrapper>
      <FriendProfile>
        <img
          src={`${uri}/assets/${friendEmail}-user-profile-${friendPicturePath}`}
          alt="Friend profile"
        />
        <h2>{friendName}</h2>
        <h3>{friendEmail}</h3>
      </FriendProfile>
      <ButtonsGroup>
        {!isHistoryChecking && (
          <>
            <Tooltip
              title={
                <h2 style={{ fontWeight: 300, fontSize: "1rem" }}>
                  Go back to dashboard
                </h2>
              }
            >
              <button onClick={goBack}>
                <ArrowBackIosNewSharpIcon />
              </button>
            </Tooltip>
            <Tooltip
              title={
                <h2 style={{ fontWeight: 300, fontSize: "1rem" }}>
                  Remove friend
                </h2>
              }
            >
              <button onClick={removeFriend}>
                <RemoveCircleSharpIcon />
              </button>
            </Tooltip>
          </>
        )}

        <Tooltip
          title={
            <h2 style={{ fontWeight: 300, fontSize: "1rem" }}>
              Check chat history
            </h2>
          }
        >
          <button
            onClick={() => setIsHistoryChecking(!isHistoryChecking)}
            style={{
              backgroundColor: isHistoryChecking
                ? colors.__colors_accent_pr
                : colors.__colors_bg_pr,
            }}
          >
            <TimerIcon
              sx={{
                color: !isHistoryChecking
                  ? colors.__colors_font_sec
                  : colors.__colors_bg_pr,
              }}
            />
          </button>
        </Tooltip>
      </ButtonsGroup>
    </Wrapper>
  );
};

export default DmSidebar;

const Wrapper = styled.div`
  width: 15rem;
  height: 100%;
  box-shadow: 7px 0px 5px -8px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
`;

const FriendProfile = styled.div`
  padding: 1rem;

  img {
    width: 100%;
    border-radius: 10px;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 300;
  }

  h3 {
    font-size: 0.9rem;
    font-weight: 300;
    margin-top: -5px;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  margin-top: auto;
  padding: 1rem;

  h2 {
    font-weight: 300;
  }

  button {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    margin-right: 10px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 0px rgb(0, 0, 0, 0.5);
    cursor: pointer;
    transition: 0.2s;

    &:nth-child(1) {
      &:hover {
        background-color: var(--colors-accent-pr);
        svg {
          color: var(--colors-bg-pr);
        }
      }
    }

    &:nth-child(2) {
      &:hover {
        background-color: #e66969;
        svg {
          color: var(--colors-bg-pr);
        }
      }
    }
  }
`;
