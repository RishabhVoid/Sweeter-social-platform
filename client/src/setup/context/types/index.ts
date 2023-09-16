import React from "react";

export type AlertState = {
  messages: Array<string>;
};

type ChoicesState = {
  messages: Array<string>;
  choices: Array<string>;
  callback: (choice: string) => void;
};

export type UserState = {
  name: string;
  email: string;
  picturePath: string;
  friendsList: Array<string>;
};

type AppContextTypeDef = {
  isValidUser: boolean;
  setIsValidUser: React.Dispatch<React.SetStateAction<boolean>>;
  alertState: AlertState;
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>;
  choicesState: ChoicesState;
  setChoicesState: React.Dispatch<React.SetStateAction<ChoicesState>>;
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
};

export default AppContextTypeDef;
