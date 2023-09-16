import { styled, css } from "styled-components";
import CustomButton from "../../CustomButton";
import { useContext } from "react";
import { AppContext } from "../../../../setup/context";

const CustomAlertPrompt = () => {
  const { alertState, setAlertState } = useContext(AppContext);

  const isVis = Boolean(alertState.messages[0].trim());

  return (
    <Wrapper $visible={isVis}>
      <PromptWrapper>
        <ul>
          {alertState.messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <CustomButton
          title="Close"
          callback={() => {
            setAlertState({
              messages: [""],
            });
          }}
        />
      </PromptWrapper>
    </Wrapper>
  );
};

export default CustomAlertPrompt;

const Wrapper = styled.div<{ $visible: boolean }>`
  z-index: 100;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: 0.1s;

  ${(props) =>
    !props.$visible &&
    css`
      transform: scale(0);
    `}
`;

const PromptWrapper = styled.div`
  border-radius: 10px;
  max-width: 30rem;
  width: 90%;
  box-shadow: -1px 1px 5px rgb(0, 0, 0, 0.6);
  background-color: var(--colors-bg-pr);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ul {
    margin-bottom: 1rem;
    width: 100%;

    li {
      list-style: none;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
  }
`;
