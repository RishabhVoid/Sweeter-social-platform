import { useContext } from "react";
import { AppContext } from "../../../../setup/context";
import CustomButton from "../../CustomButton";
import { styled } from "styled-components";

const CustomChoicesPromt = () => {
  const { choicesState, setChoicesState } = useContext(AppContext);

  return (
    <Wrapper
      style={{
        display: choicesState.messages[0] !== "" ? "flex" : "none",
      }}
    >
      <Prompt>
        {choicesState.messages.map((message, index) => (
          <h2 key={index}>{message}</h2>
        ))}
        <ChoicesGroup>
          {choicesState.choices.map((choice, index) => (
            <CustomButton
              key={index}
              title={choice}
              callback={() => {
                choicesState.callback(choice);
                setChoicesState({
                  messages: [""],
                  choices: ["Yes", "No"],
                  callback: () => {},
                });
              }}
            />
          ))}
        </ChoicesGroup>
      </Prompt>
    </Wrapper>
  );
};

export default CustomChoicesPromt;

const Wrapper = styled.div`
  position: absolute;
  z-index: 110;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Prompt = styled.div`
  box-shadow: 0px 0px 5px 0px rgb(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 5px;
  max-width: 30rem;

  h2 {
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--font-pr);
  }
`;

const ChoicesGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;

  button {
    margin: 5px;
  }
`;
