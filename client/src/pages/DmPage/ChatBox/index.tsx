import { useContext, useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../../setup/store/types/stateTypeDef";
import getFormattedTime from "../../../common/utils/getFormattedTime";
import { Socket } from "socket.io-client";
import { ResponsdeCodes } from "../../../common/errorCodes";
import { AppContext } from "../../../setup/context";

type props = {
  dmId: string | undefined;
  socketConnector: Socket;
  isHistoryChecking: boolean;
  bucketNo: Number;
};

type MessagesType = {
  senderEmail: string;
  timeStamp: string;
  textMessage: string;
};

const ChatBox = ({
  dmId,
  socketConnector,
  isHistoryChecking,
  bucketNo,
}: props) => {
  const [messages, setMessages] = useState<Array<MessagesType>>([]);
  const bottomDiv = useRef<HTMLDivElement | null>(null);
  const parentDiv = useRef<HTMLDivElement | null>(null);

  const { userState } = useContext(AppContext);
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);

  const scrollChatToBottom = () => {
    if (bottomDiv.current && parentDiv.current) {
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getInitialDmMessages = async (bucketNo: Number) => {
    const rawData = await fetch(
      `${uri}/user/getDmMessages/${dmId}_${bucketNo}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await rawData.json();
    if (jsonData.status === ResponsdeCodes.SUCCESS) {
      setMessages(jsonData.data as Array<MessagesType>);
    } else {
      setMessages([
        {
          senderEmail: "@gmail.com",
          timeStamp: "0-0-0-0-0",
          textMessage: "No messages were found!",
        },
      ]);
    }
  };

  useEffect(() => {
    socketConnector.on("sync_dm_messages", (data) => {
      const message = data.message;
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  useEffect(() => {
    if (!isHistoryChecking) {
      (async () => await getInitialDmMessages(-1))();
    } else {
      (async () => await getInitialDmMessages(bucketNo))();
    }
  }, [isHistoryChecking, bucketNo]);

  useEffect(() => {
    scrollChatToBottom();
  }, [messages.length]);

  return (
    <Wrapper ref={parentDiv}>
      {messages.map((message, index) => {
        const isUserSender = userState.email === message.senderEmail;
        const isSystemMessage = message.timeStamp === "0-0-0-0-0";
        return (
          <Message
            key={index}
            $userSent={isUserSender}
            $system={isSystemMessage}
          >
            <h2>{message.textMessage}</h2>
            {isHistoryChecking ? (
              <h4>{getFormattedTime(message.timeStamp, true)}</h4>
            ) : (
              <h4>{getFormattedTime(message.timeStamp)}</h4>
            )}
          </Message>
        );
      })}
      <div ref={bottomDiv} className="bottom_bar"></div>
    </Wrapper>
  );
};

export default ChatBox;

const Wrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 5rem 1rem;
  padding-bottom: 0rem;
  position: relative;
  z-index: 5;

  .bottom_bar {
    border: 1px solid transparent;
    margin-bottom: 4rem;
  }

  &::-webkit-scrollbar {
    background: var(--colors-bg-sec);
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--colors-accent-pr);
    border-radius: 10px;
  }
`;

const Message = styled.div<{ $userSent?: boolean; $system?: boolean }>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  min-width: 15rem;
  max-width: 30rem;
  background-color: var(--colors-op-accent-pr);

  h2 {
    font-weight: 300;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  h4 {
    font-weight: 300;
    margin-left: auto;
    font-size: 0.6rem;
  }

  ${(props) =>
    props.$userSent &&
    css`
      background-color: var(--colors-accent-pr);
      color: var(--colors-bg-pr);
      align-self: flex-end;
    `}

  ${(props) =>
    props.$system &&
    css`
      background-color: var(--colors-op-accent-sec);
      color: var(--colors-font-pr);
      align-self: center;

      h2 {
        margin-bottom: 0;
      }

      h4 {
        display: none;
      }
    `}
`;
