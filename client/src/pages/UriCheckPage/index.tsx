import { styled } from "styled-components";
import CustomButton from "../../common/components/CustomButton";
import { FormEvent, useContext, useRef } from "react";
import { AppContext } from "../../setup/context";
import { useNavigate } from "react-router-dom";
import { setUri } from "../../setup/store/actions";
import { useDispatch } from "react-redux";
import { ResponsdeCodes } from "../../common/errorCodes";

const UriCheckPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setAlertState } = useContext(AppContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    if (!inputRef.current.value.trim()) {
      setAlertState({
        messages: ["Uri cannot be empty!"],
      });
      return;
    }

    try {
      const rawData = await fetch(`${inputRef.current.value}/check/uri`);
      if (!rawData.ok) {
        // rawData.ok = true only when status is 200 or in range around 200-299
        setAlertState({
          messages: [
            "Network response wasn't ok",
            "Restart the app or contact developer if problem persues.",
          ],
        });
        return;
      }
      const jsonData = await rawData.json();
      if (jsonData.status === ResponsdeCodes.SUCCESS) {
        dispatch(setUri(inputRef.current.value));
        navigate("/auth/sign_up");
        return;
      }
      setAlertState({
        messages: ["Mentioned API doesn't have required endpoints!"],
      });
    } catch (error) {
      setAlertState({
        messages: [
          "Provided uri was invalid or has been expired!",
          "Ask for a new uri to keep session working.",
        ],
      });
    }
  };

  return (
    <Wrapper>
      <FormWrapper onSubmit={formSubmit}>
        <input type="text" placeholder="Enter uri here..." ref={inputRef} />
        <CustomButton title="Check uri" type="submit" />
      </FormWrapper>
    </Wrapper>
  );
};

export default UriCheckPage;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 20rem;
  align-items: center;

  input {
    width: 100%;
    padding: 10px;
    border: 0;
    box-shadow: -1px 1px 5px rgb(0, 0, 0, 0.6);
    border-radius: 5px;
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--colors-font-pr);

    &:focus {
      outline: none;
    }
  }

  button {
    width: 50%;
  }
`;
