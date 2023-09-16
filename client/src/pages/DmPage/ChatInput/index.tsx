import { styled } from "styled-components";
import { useRef, FormEvent, KeyboardEvent, useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import { AppContext } from "../../../setup/context";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../../setup/store/types/stateTypeDef";
import { ResponsdeCodes } from "../../../common/errorCodes";
import { Socket } from "socket.io-client";

type props = {
  dmId: String | undefined;
  socketConnector: Socket;
};

const date = new Date();

const ChatInput = ({ dmId, socketConnector }: props) => {
  const { userState, setAlertState } = useContext(AppContext);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputRef.current) return;
    const inputValue = inputRef.current.value;
    const timeStamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    const senderEmail = userState.email;

    if (!inputValue.trim()) return;

    const rawData = await fetch(`${uri}/user/postDmMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tunnelId: dmId,
        senderEmail: senderEmail,
        textMessage: inputValue,
        timeStamp: timeStamp,
      }),
    });

    const jsonData = await rawData.json();

    if (jsonData.status === ResponsdeCodes.SUCCESS) {
      inputRef.current.value = "";
      socketConnector.emit("new_dm_message", {
        dmId,
        textMessage: inputValue,
        timeStamp,
        senderEmail,
      });
      return;
    }
    setAlertState({
      messages: [
        "There was a problem connecting to the server!",
        "Re-login if the problem persues.",
      ],
    });
  };

  return (
    <Wrapper>
      <Input onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          placeholder="Type here..."
          onKeyDown={handleKeyDown}
        />
        <button type="submit">
          <SendIcon />
        </button>
      </Input>
    </Wrapper>
  );
};

export default ChatInput;

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 1rem 2rem;
  padding-top: 0;
`;

const Input = styled.form`
  width: 100%;
  height: 3rem;
  border-radius: 50px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 10, 0.75);
  position: relative;
  z-index: 10;
  background: var(--colors-bg-pr);
  display: flex;

  textarea {
    flex: 1;
    border: 0;
    font-size: 1.1rem;
    padding: 0.5rem 1.1rem;
    margin-top: 0.4rem;
    resize: none;
    border-radius: 50px 0px 0px 50px;

    &::-webkit-scrollbar {
      width: 0px;
    }

    &:focus {
      outline: none;
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--colors-accent-pr);
    border: 0px;
    height: 100%;
    width: 50px;
    border-radius: 0px 50px 50px 0px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: var(--colors-accent-sec);
    }

    svg {
      color: var(--colors-bg-pr);
    }
  }
`;
