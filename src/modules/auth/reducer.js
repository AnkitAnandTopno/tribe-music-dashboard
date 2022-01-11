import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  accessToken: "",
  admin: {}
};

export const { setAccessToken, setAdmin } = createActions({
  SET_ACCESS_TOKEN: accessToken => accessToken,
  SET_ADMIN: admin => admin
});

// Reducer
const reducer = handleActions(
  {
    SET_ACCESS_TOKEN: (state, action) => {
      return _.assign({}, state, action.payload);
    },
    SET_ADMIN: (state, action) => {
      return _.assign({}, state, action.payload);
    }
  },
  defaultState
);
export default reducer;

export const getAccessToken = state => state.auth.accessToken;
