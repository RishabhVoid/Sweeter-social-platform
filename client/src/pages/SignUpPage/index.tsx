import { styled } from "styled-components";
import useSignUp from "./hooks/useSignUp";
import { useCallback, useContext, useEffect, useState } from "react";
import CustomButton from "../../common/components/CustomButton";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import colors from "../../common/data/colors";
import config from "../../common/data/config";
import { useDropzone } from "react-dropzone";
import { AppContext } from "../../setup/context";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const { setAlertState } = useContext(AppContext);

  const [isDisabled, setIsDisabled] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureFileName, setPictureFileName] = useState("");

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    errors,
    values,
    touched,
  } = useSignUp(setIsDisabled, pictureFile);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      setAlertState({
        messages: ["Please provide with a valid file!"],
      });
      return;
    }
    setPictureFile(file);
    setPictureFileName(file.name);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // For some reason making accept a list of strings is spiting out error.
    // To check later.
    //@ts-ignore
    accept: [".png", ".jpeg", ".jpg"],
    multiple: false,
    maxSize: config.maxSizeInBytes,
  });

  useEffect(() => {
    document.title = "Sweeter Sign-Up";
  }, []);

  return (
    <Wrapper>
      <FormWrapper
        onSubmit={handleSubmit}
        style={{
          pointerEvents: isDisabled ? "none" : "all",
        }}
      >
        <h1>Sign up</h1>
        <h3>
          Already have an account? <Link to={"/auth/log_in"}>Log in</Link>
        </h3>
        <HorizontleInfoWrapper>
          <SingleInfoWrapper>
            <label htmlFor="name">User name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Type your name here..."
            />
            {errors.name && touched.name ? <p>{errors.name}</p> : null}
          </SingleInfoWrapper>
          <SingleInfoWrapper>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Type your email here..."
            />
            {errors.email && touched.email ? <p>{errors.email}</p> : null}
          </SingleInfoWrapper>
        </HorizontleInfoWrapper>
        <HorizontleInfoWrapper>
          <SingleInfoWrapper>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Type your password here..."
            />
            {errors.password && touched.password ? (
              <p>{errors.password}</p>
            ) : null}
          </SingleInfoWrapper>
          <SingleInfoWrapper>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm password..."
            />
            {errors.confirm_password && touched.confirm_password ? (
              <p>{errors.confirm_password}</p>
            ) : null}
          </SingleInfoWrapper>
        </HorizontleInfoWrapper>
        <HorizontleInfoWrapper>
          <CustomButton title="Sign up" disabled={isDisabled} type="submit" />
          <CustomButton
            disabled={isDisabled}
            title="Clear form"
            style={{
              marginLeft: "1rem",
              background: "transparent",
              border: `2px solid ${colors.__colors_accent_pr}`,
              color: colors.__colors_accent_pr,
            }}
            callback={resetForm}
          />
        </HorizontleInfoWrapper>
        <HorizontleInfoWrapper>
          <Dropzone
            {...getRootProps()}
            style={{
              backgroundColor: isDragActive
                ? colors.__colors_accent_pr
                : colors.__colors_bg_pr,
            }}
          >
            <input {...getInputProps} type="hidden" />
            <AddPhotoAlternateIcon
              sx={{
                color: isDragActive
                  ? colors.__colors_bg_pr
                  : colors.__colors_accent_pr,
              }}
            />
            {isDragActive ? (
              <h2 style={{ color: colors.__colors_bg_pr }}>
                Drop the pocture to upload...
              </h2>
            ) : pictureFileName.trim().length !== 0 ? (
              <h2>Selected file: {pictureFileName}</h2>
            ) : (
              <h2>Click or drag-drop to add profile pic..</h2>
            )}
          </Dropzone>
        </HorizontleInfoWrapper>
      </FormWrapper>
    </Wrapper>
  );
};

export default SignUpPage;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 45rem;

  h3 {
    font-size: 0.8rem;
    font-weight: 300;
  }

  input {
    font-size: 1rem;
    padding: 10px;
    margin: 1rem 0rem;
    margin-right: 1rem;
    border-radius: 10px;
    border: 0;
    box-shadow: -1px 1px 5px rgb(0, 0, 0, 0.6);

    &:focus {
      outline: none;
    }
  }
`;

const HorizontleInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
`;

const SingleInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;

  p {
    color: red;
    font-size: 0.8rem;
  }
`;

const Dropzone = styled.div`
  box-shadow: -1px 1px 5px rgb(0, 0, 0, 0.6);
  border-radius: 10px;
  margin-inline: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 90%;
  transition: 0.3s;

  input {
    position: absolute;
    z-index: 30;
    top: -1rem;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    cursor: pointer;
  }
`;
