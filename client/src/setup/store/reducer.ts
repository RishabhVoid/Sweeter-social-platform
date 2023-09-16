import { SET_ID, SET_TOKEN, SET_URI } from "../../common/storeActions";
import ActionsTypeDef from "./types/actionsTypeDef";
import StoreStateTypeDef from "./types/stateTypeDef";

const initialState: StoreStateTypeDef = {
  sweeter_uri: "",
  sweeter_id: "",
  sweeter_token: "",
};

const rootReducer = (
  state: StoreStateTypeDef = initialState,
  action: ActionsTypeDef
): StoreStateTypeDef => {
  switch (action.type) {
    case SET_ID: {
      return {
        ...state,
        sweeter_id: action.payload.id,
      };
    }

    case SET_URI: {
      return {
        ...state,
        sweeter_uri: action.payload.uri,
      };
    }

    case SET_TOKEN: {
      return {
        ...state,
        sweeter_token: action.payload.token,
      };
    }

    default: {
      return state;
    }
  }
};

export default rootReducer;
