import { SET_ID, SET_TOKEN, SET_URI } from "../../../common/storeActions";

type SetIdAction = {
  type: typeof SET_ID;
  payload: {
    id: string;
  };
};

type SetUriAction = {
  type: typeof SET_URI;
  payload: {
    uri: string;
  };
};

type SetTokenAction = {
  type: typeof SET_TOKEN;
  payload: {
    token: string;
  };
};

type ActionsTypeDef = SetIdAction | SetUriAction | SetTokenAction;

export default ActionsTypeDef;
