import { motion } from "framer-motion";
import { css, styled } from "styled-components";
import bopClickVariant from "../../motions/bopClickVariant";
import nullVariant from "../../motions/nullVariant";

type props = {
  title?: string;
  callback?: () => void;
  ghost?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: object;
  stopBopping?: boolean;
};

const CustomButton = ({
  title = "Default",
  callback = () => {},
  ghost = false,
  disabled = false,
  type = "button",
  style = {},
  stopBopping = false,
}: props) => {
  return (
    <Wrapper
      $ghost={ghost}
      $disabled={disabled}
      $stopBopping={stopBopping}
      onClick={() => {
        if (disabled) return;
        callback();
      }}
      variants={!stopBopping ? bopClickVariant : nullVariant}
      whileHover={!stopBopping ? "hover" : "none"}
      whileTap={!stopBopping ? "click" : "none"}
      type={type}
      style={style}
    >
      {title}
    </Wrapper>
  );
};

export default CustomButton;

const Wrapper = styled(motion.button)<{
  $ghost: boolean;
  $disabled: boolean;
  $stopBopping: boolean;
}>`
  position: relative;
  padding: 10px 20px;
  border-radius: 5px;
  border: 0px;
  font-size: 0.9rem;
  background-color: var(--colors-accent-pr);
  color: var(--colors-bg-pr);
  cursor: pointer;
  z-index: 60;

  ${(props) =>
    props.$ghost &&
    css`
      background-color: transparent;
      border: 1px solid var(--colors-accent-pr);
      color: var(--colors-bg-pr);
    `}

  ${(props) =>
    props.$disabled &&
    css`
      background-color: transparent;
      border: 1px solid var(--colors-font-sec);
      color: var(--colors-font-sec);
      pointer-events: none;
    `}
  
  ${(props) =>
    props.$stopBopping &&
    css`
      transition: 0.2s;
      &:hover {
        background-color: var(--colors-bg-sec);
        color: var(--colors-font-pr);
      }
    `}
`;
