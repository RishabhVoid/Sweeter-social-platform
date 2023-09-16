import React, { createContext, useMemo, useState } from "react";
import AppContextTypeDef, { UserState } from "./types";

export const AppContext = createContext<AppContextTypeDef>({
  isValidUser: false,
  setIsValidUser: () => {},
  alertState: {
    messages: [""],
  },
  setAlertState: () => {},
  choicesState: {
    messages: [""],
    //@ts-expect-error
    callback: (choice: string) => {},
    choices: [""],
  },
  setChoicesState: () => {},
  userState: {
    name: "",
    email: "",
    picturePath: "",
    friendsList: [],
  },
  setUserState: () => {},
});

type props = {
  children: React.ReactNode;
};

const AppContextProvider = ({ children }: props) => {
  const [isValidUser, setIsValidUser] = useState(false);
  const [alertState, setAlertState] = useState({
    messages: [""],
  });
  const [choicesState, setChoicesState] = useState({
    messages: [""],
    //@ts-expect-error
    callback: (choice: string) => {},
    choices: [""],
  });
  const [userState, setUserState] = useState<UserState>({
    name: "",
    email: "",
    picturePath: "",
    friendsList: [],
  });

  const values = useMemo(
    () => ({
      isValidUser,
      setIsValidUser,
      alertState,
      setAlertState,
      choicesState,
      setChoicesState,
      userState,
      setUserState,
    }),
    [isValidUser, alertState, choicesState, userState]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
