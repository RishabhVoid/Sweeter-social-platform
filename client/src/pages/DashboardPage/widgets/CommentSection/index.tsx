import { styled } from "styled-components";
import { FormEvent, useState, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../../../setup/store/types/stateTypeDef";
import { AppContext } from "../../../../setup/context";
import { ResponsdeCodes } from "../../../../common/errorCodes";
import CloseIcon from "@mui/icons-material/Close";

type props = {
  setSelectedCommentsId: React.Dispatch<React.SetStateAction<string>>;
  selectedCommentsId: String;
};

type CommentType = {
  commenterName: String;
  comment: String;
  commenterEmail: String;
  commenterPicturePath: String;
};

const CommentSection = ({
  selectedCommentsId,
  setSelectedCommentsId,
}: props) => {
  const [comments, setComments] = useState<Array<CommentType>>([]);

  const { userState, setAlertState } = useContext(AppContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);

  const postComment = async () => {
    if (!inputRef.current) return;
    const comment = inputRef.current.value;
    if (!comment.trim().length) return;

    const rawData = await fetch(`${uri}/posts/addComment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        commentId: selectedCommentsId,
        commenterName: userState.name,
        comment,
        commenterEmail: userState.email,
        commenterPicturePath: userState.picturePath,
      }),
    });
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
      setComments((comments) => {
        return [
          {
            commenterName: userState.name,
            commenterEmail: userState.email,
            commenterPicturePath: userState.picturePath,
            comment,
          },
          ...comments,
        ];
      });
      inputRef.current.value = "";
    }
  };

  const loadComments = async () => {
    const rawData = await fetch(
      `${uri}/posts/getComments/${selectedCommentsId}`,
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
      setComments(jsonData.data as Array<CommentType>);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    (async () => await postComment())();
  };

  useEffect(() => {
    (async () => loadComments())();
  }, []);

  return (
    <Wrapper>
      <CommentInput onSubmit={handleSubmit}>
        <CloseIcon onClick={() => setSelectedCommentsId("")} />
        <input type="text" ref={inputRef} placeholder="Add your comment!..." />
        <button type="submit">
          <h1>POST</h1>
        </button>
      </CommentInput>
      <CommentsList>
        {comments.map((comment, index) => (
          <Comment key={index}>
            <CommenterInfo>
              <img
                src={`${uri}/assets/${comment.commenterEmail}-user-profile-${comment.commenterPicturePath}`}
                alt="X"
              />
              <span>
                <h2>{comment.commenterName}</h2>
                <h3>{comment.commenterEmail}</h3>
              </span>
            </CommenterInfo>
            <p>{comment.comment}</p>
          </Comment>
        ))}
      </CommentsList>
    </Wrapper>
  );
};

export default CommentSection;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CommentInput = styled.form`
  display: flex;
  height: 2rem;

  svg {
    color: var(--colors-accent-pr);
    cursor: pointer;
    margin-right: 5px;
  }

  input {
    font-size: 1rem;
    padding: 5px;
    flex: 1;
    border: 0;
    border-bottom: 1px solid var(--colors-accent-pr);

    &:focus {
      outline: none;
    }
  }

  button {
    color: var(--colors-accent-pr);
    border: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
    padding: 0px 10px;
    background-color: transparent;
    cursor: pointer;

    h1 {
      font-size: 1rem;
    }
  }
`;

const CommentsList = styled.div`
  height: calc(100vh - 7rem);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    background-color: var(--colors-bg-sec);
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--colors-accent-pr);
    border-radius: 10px;
  }
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
  margin-right: 10px;

  p {
    font-size: 0.9rem;
    margin-left: 40px;
  }
`;

const CommenterInfo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 35px;
    height: 35px;
    border-radius: 100px;
    object-fit: cover;
    object-position: center;
  }

  span {
    margin-left: 5px;

    h2 {
      font-size: 1rem;
      margin-top: -5px;
    }

    h3 {
      font-size: 0.6rem;
      font-weight: 300;
      margin-top: -5px;
    }
  }
`;
