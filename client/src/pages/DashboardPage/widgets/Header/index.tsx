import { styled } from "styled-components";
import { AppContext } from "../../../../setup/context";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoreStateTypeDef from "../../../../setup/store/types/stateTypeDef";
import IcecreamIcon from "@mui/icons-material/Icecream";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { useNavigate } from "react-router-dom";
import { setId, setToken } from "../../../../setup/store/actions";

const DashboardHeader = () => {
  const { userState, setUserState } = useContext(AppContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const [menuDropped, setMenuDropped] = useState(false);

  const userLogOut = () => {
    dispatch(setToken(""));
    dispatch(setId(""));
    setUserState({
      name: "",
      email: "",
      friendsList: [],
      picturePath: "",
    });
    navigate("/");
  };

  const fixIssues = () => {
    navigate("/");
  };

  return (
    <Header>
      <img
        src={`${uri}/assets/${userState.email}-user-profile-${userState.picturePath}`}
        alt="X"
      />
      <UserInfo>
        <h2>{userState.name || "Loading..."}</h2>
        <h3>{userState.email || "Loading..."}</h3>
      </UserInfo>
      <LogoTitle>
        <IcecreamIcon />
        <h1>Sweeter</h1>
        <DropDownOptions onClick={() => setMenuDropped(!menuDropped)}>
          <ArrowDropDownCircleIcon
            className={menuDropped ? "menu_dropped" : ""}
          />
        </DropDownOptions>
        <DropDownMenu
          style={{
            opacity: menuDropped ? 1 : 0,
            top: menuDropped ? "3.5rem" : "-150%",
            zIndex: menuDropped ? 110 : -1,
          }}
        >
          <h2>Menu</h2>
          <ul>
            <li onClick={userLogOut}>Log Out</li>
            <li onClick={fixIssues}>Fix Issues</li>
          </ul>
        </DropDownMenu>
      </LogoTitle>
    </Header>
  );
};

export default DashboardHeader;

const Header = styled.div`
  height: 3.5rem;
  width: 100%;
  display: flex;
  background-color: var(--colors-accent-pr);
  align-items: center;
  padding: 0rem 1rem;

  img {
    width: 35px;
    height: 35px;
    border-radius: 100px;
    object-position: center;
    object-fit: cover;
    margin-right: 1rem;
  }
`;

const UserInfo = styled.div`
  color: var(--colors-bg-pr);
  height: fit-content;

  h2 {
    font-size: 1rem;
    font-weight: 300;
  }

  h3 {
    font-weight: 300;
    font-size: 0.8rem;
    position: relative;
    top: -5px;
  }
`;

const LogoTitle = styled.div`
  margin-left: auto;
  display: flex;
  font-size: 0.7rem;
  color: var(--colors-bg-pr);
  align-items: center;
  position: relative;
  overflow: visible;

  svg {
    font-size: 2rem;
    transform: rotateZ(20deg);
  }
`;

const DropDownOptions = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 10;

  svg {
    font-size: 1.7rem;
    transform: rotateZ(0deg);
    transition: 0.3s;
  }

  .menu_dropped {
    transform: rotateZ(180deg);
  }
`;

const DropDownMenu = styled.div`
  padding: 0.5rem;
  position: absolute;
  top: 0;
  left: -3rem;
  background-color: var(--colors-bg-pr);
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  color: var(--colors-font-pr);
  width: 10rem;
  transition: 0.3s;

  h2 {
    margin-bottom: 10px;
    padding: 0px 5px;
    font-size: 1.2rem;
    font-weight: 300;
  }

  ul {
    padding: 0px 3px;

    li {
      padding: 5px 10px;
      text-align: center;
      margin-bottom: 10px;
      list-style: none;
      border: 5px;
      font-size: 0.9rem;
      cursor: pointer;
      border-radius: 5px;
      background-color: var(--colors-bg-sec);
      transition: 0.1s;

      &:hover {
        color: var(--colors-bg-pr);
        background-color: var(--colors-accent-pr);
      }
    }
  }
`;
