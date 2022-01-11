import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  onlineChurch: []
};

export const {
  addOnlineChurch,
  setOnlineChurch,
  editOnlineChurch
} = createActions({
  ADD_ONLINE_CHURCH: onlineChurch => onlineChurch,
  SET_ONLINE_CHURCH: onlineChurch => onlineChurch,
  EDIT_ONLINE_CHURCH: onlineChurch => onlineChurch
});

// Reducer
const reducer = handleActions(
  {
    ADD_ONLINE_CHURCH: (state, action) => {
      let newOnlineChurch = _.cloneDeep(state.onlineChurch);
      newOnlineChurch.push(action.payload);
      return _.assign({}, state, { onlineChurch: newOnlineChurch });
    },
    SET_ONLINE_CHURCH: (state, action) => {
      console.log(action.payload);
      return _.assign({}, state, { onlineChurch: action.payload });
    },
    EDIT_ONLINE_CHURCH: (state, action) => {
      let newOnlineChurch = _.cloneDeep(state.onlineChurch);
      newOnlineChurch[action.payload.index] = action.payload.onlineChurch;
      return _.assign({}, state, { onlineChurch: newOnlineChurch });
    }
  },
  defaultState
);
export default reducer;

export const getOnlineChurch = state => state.onlineChurch.onlineChurch;
