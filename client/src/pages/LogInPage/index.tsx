import { Link } from "react-router-dom";
import { styled } from "styled-components";
import CustomButton from "../../common/components/CustomButton";
import colors from "../../common/data/colors";
import useLogIn from "./hooks/useLogIn";
import { useEffect, useState } from "react";

const LogInPage = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useLogIn(setIsDisabled);

  useEffect(() => {
    document.title = "Sweeter Log-In";
  }, []);

  return (
    <Wrapper>
      <FormWrapper
        style={{
          pointerEvents: isDisabled ? "none" : "all",
        }}
      >
        <h1>Log in</h1>
        <h3>
          Don't have an account yet? <Link to={"/auth/sign_up"}>Register</Link>
        </h3>
        <SingleInfoWrapper>
          <label htmlFor="email">User email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Type your email here..."
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && touched.email ? <p>{errors.email}</p> : null}
        </SingleInfoWrapper>
        <SingleInfoWrapper>
          <label htmlFor="password">User password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Type your password here..."
            onBlur={handleBlur}
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && touched.password ? (
            <p>{errors.password}</p>
          ) : null}
        </SingleInfoWrapper>
        <HorizontleInfoWrapper>
          <CustomButton title="Log In" callback={handleSubmit} />
          <CustomButton
            title="Clear form"
            callback={resetForm}
            style={{
              marginLeft: "1rem",
              background: "transparent",
              border: `2px solid ${colors.__colors_accent_pr}`,
              color: colors.__colors_accent_pr,
            }}
          />
        </HorizontleInfoWrapper>
      </FormWrapper>
    </Wrapper>
  );
};

export default LogInPage;

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 30rem;

  h3 {
    font-size: 0.8rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
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

const SingleInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  p {
    color: red;
    font-size: 0.8rem;
  }
`;

const HorizontleInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
`;
