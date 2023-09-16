import { SET_ID, SET_TOKEN, SET_URI } from "../../common/storeActions";
import ActionsTypeDef from "./types/actionsTypeDef";

export const setId = (id: string): ActionsTypeDef => ({
  type: SET_ID,
  payload: {
    id,
  },
});

export const setUri = (uri: string): ActionsTypeDef => ({
  type: SET_URI,
  payload: {
    uri,
  },
});

export const setToken = (token: string): ActionsTypeDef => ({
  type: SET_TOKEN,
  payload: {
    token,
  },
});
