import { CircularProgress } from "@mui/material";
import { styled } from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StoreStateTypeDef from "../../setup/store/types/stateTypeDef";
import { setId, setToken, setUri } from "../../setup/store/actions";
import { ResponsdeCodes } from "../../common/errorCodes";

const StartupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const token = useSelector((state: StoreStateTypeDef) => state.sweeter_token);

  const removeUser = () => {
    dispatch(setToken(""));
    dispatch(setId(""));
  };

  const checkExistingUser = async (token: string) => {
    const rawData = await fetch(`${uri}/auth/tokenVerify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });
    const jsonData = await rawData.json();

    if (!rawData.ok) {
      navigate("/auth/sign_up");
      return;
    }

    if (jsonData.status === ResponsdeCodes.VALID_TOKEN) {
      navigate("/app/dashboard");
    }
  };

  const checkUri = async (uri: string) => {
    if (!uri.trim()) {
      navigate("/auth/uri_check");
      return;
    }

    const rawData = await fetch(`${uri}/check/uri`);
    const jsonData = await rawData.json();
    if (jsonData.status === ResponsdeCodes.SUCCESS) {
      if (!token.trim()) {
        removeUser();
        navigate("/auth/sign_up");
        return;
      }
      checkExistingUser(token);
      return;
    }
    removeUser();
    dispatch(setUri(""));
    navigate("/auth/uri_check");
  };

  useEffect(() => {
    (async () => await checkUri(uri))();
  }, []);

  const reloadPage = () => window.location.reload();

  const handleIssueFix = () => {
    removeUser();
    dispatch(setUri(""));
    navigate("/");
    reloadPage();
  };

  return (
    <Wrapper>
      <h1>Loading...</h1>
      <CircularProgress />
      <a onClick={handleIssueFix}>Loading too long? Click here...</a>
    </Wrapper>
  );
};

export default StartupPage;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    margin-bottom: 1rem;
  }

  a {
    font-size: 0.9rem;
    margin-top: 1rem;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
`;
