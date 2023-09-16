import { css, styled } from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";
import React, { useCallback, useState, useRef, useContext } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CustomButton from "../../../../common/components/CustomButton";
import { Tooltip } from "@mui/material";
import { AppContext } from "../../../../setup/context";
import { useSelector } from "react-redux";
import StoreStateTypeDef from "../../../../setup/store/types/stateTypeDef";
import { ResponsdeCodes } from "../../../../common/errorCodes";

type props = {
  setPostsModalVis: React.Dispatch<React.SetStateAction<boolean>>;
  addPost: (
    _id: string,
    posterName: string,
    posterEmail: string,
    desc: string,
    picturePath: string,
    commentsId: string,
    likes: Array<String>
  ) => void;
};

const date = new Date();

const AddPostModal = ({ setPostsModalVis, addPost }: props) => {
  const [picture, setPicture] = useState<File | null>(null);
  const [pictureBlobUrl, setPictureBlobUrl] = useState("");

  const descRef = useRef<HTMLTextAreaElement>(null);

  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);

  const { userState, setAlertState } = useContext(AppContext);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const pictureFile = acceptedFiles[0];
    setPicture(pictureFile);
    const url = URL.createObjectURL(pictureFile);
    setPictureBlobUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handlePostClear = () => {
    if (!descRef.current) return;
    descRef.current.value = "";
    setPicture(null);
    setPictureBlobUrl("");
  };

  const handleSubmitPost = async () => {
    if (!descRef.current) return;
    const isPost = "1";
    const posterName = userState.name;
    const posterEmail = userState.email;
    const desc = descRef.current.value;
    const pictureFile = picture;
    const customFileName = `${date.getTime()}-${date.getSeconds()}`;
    if (!pictureFile || desc.trim().length < 10) return;

    const formData = new FormData();
    formData.append("isPost", isPost);
    formData.append("posterName", posterName);
    formData.append("posterEmail", posterEmail);
    formData.append("desc", desc);
    formData.append("customFileName", customFileName);
    formData.append("picturePath", pictureFile.name);
    formData.append("postPicture", picture);

    const rawData = await fetch(`${uri}/posts/postSinglePost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const jsonData = await rawData.json();
    if (jsonData.status === ResponsdeCodes.ERROR) {
      setAlertState({
        messages: [
          "There was an internal server error!",
          "Restart the app if the problem persues!",
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
    const postedPost = jsonData.data;
    addPost(
      postedPost._id,
      postedPost.posterName,
      postedPost.posterEmail,
      postedPost.desc,
      postedPost.picturePath,
      postedPost.commentsId,
      []
    );
    handlePostClear();
    setPostsModalVis(false);
  };

  return (
    <Wrapper>
      <CloseButton onClick={() => setPostsModalVis(false)}>
        <CloseIcon />
      </CloseButton>
      <PostPrompt>
        <Tooltip
          title={
            <h2 style={{ fontWeight: 300, fontSize: ".9rem" }}>Clear post</h2>
          }
        >
          <span onClick={handlePostClear}>{/* <CloseIcon /> */}</span>
        </Tooltip>
        <Dropzone
          {...getRootProps()}
          $pictureUrlValid={pictureBlobUrl.trim().length !== 0}
        >
          {pictureBlobUrl.trim().length !== 0 ? (
            <img src={pictureBlobUrl} alt="X" />
          ) : (
            <>
              <input type="hidden" {...getInputProps()} />
              <div className="dark_over_screen" />
              <DropzoneInfo>
                <AddAPhotoIcon />
                <h2>
                  {isDragActive
                    ? "Drop the picture to upload!"
                    : "Click to add a picture to your post!"}
                </h2>
              </DropzoneInfo>
            </>
          )}
        </Dropzone>
        <textarea
          ref={descRef}
          placeholder="Let your story fly (Minimum 10 characters)..."
        />
        <ButtonsGroup>
          <CustomButton title="Post" callback={handleSubmitPost} />
          <CustomButton title="Clear post" callback={handlePostClear} />
        </ButtonsGroup>
      </PostPrompt>
    </Wrapper>
  );
};

export default AddPostModal;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    position: absolute;
    font-size: 1.6rem;
    color: var(--colors-bg-pr);
    top: 25px;
    left: 25px;
    border-radius: 50px;
    cursor: pointer;
    transition: 0.2s;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 110;

    &:hover {
      background-color: red;
    }
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 100px;
  padding: 10px;
  position: absolute;
  right: 25px;
  top: 25px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: rotateZ(170deg);
  }
`;

const PostPrompt = styled.div`
  background-color: var(--colors-bg-pr);
  height: 90%;
  width: 35rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;

  input,
  textarea {
    padding: 5px;
    border-radius: 5px;
    resize: none;
    width: 95%;
    font-size: 0.9rem;
    margin-top: 1rem;
    border: 0;
    font-family: var(--font-family-pr);
    background: var(--colors-bg-sec);

    &:focus {
      outline: none;
    }
  }

  textarea {
    flex: 1;
  }

  button {
    margin: 1rem 0rem;
    width: 40%;
  }
`;

const Dropzone = styled.div<{ $pictureUrlValid: boolean }>`
  height: 60%;
  border-radius: 5px 5px 0px 0px;
  display: flex;
  position: relative;
  background: url("/dancing.svg");
  width: 100%;
  background-position: center;
  background-size: cover;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  ${(props) =>
    props.$pictureUrlValid &&
    css`
      background: var(--colors-font-sec);
    `}

  input {
    position: absolute;
    z-index: 90;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: pink;
    flex: 1;
  }

  .dark_over_screen {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgb(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
`;

const DropzoneInfo = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    color: var(--colors-bg-pr);
    font-size: 5rem;
  }

  h2 {
    color: var(--colors-bg-pr);
    font-size: 1rem;
    font-weight: 300;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  width: 100%;
  padding: 0rem 1rem;
  justify-content: center;

  button {
    margin: 1rem;
    width: 30%;

    &:last-child {
      background-color: rgb(102, 131, 68);
    }
  }
`;
