import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  unsavedItemUpdate: []
};

export const { addUnsavedItemUpdate, emptyUnsavedItemUpdate } = createActions({
  ADD_UNSAVED_ITEM_UPDATE: itemUpdate => itemUpdate,
  EMPTY_UNSAVED_ITEM_UPDATE: () => {}
});

// Reducer
const reducer = handleActions(
  {
    ADD_UNSAVED_ITEM_UPDATE: (state, action) => {
      let newUnsavedItemUpdate = _.cloneDeep(state.unsavedItemUpdate);
      let itemUpdate = action && action.payload;
      let updateIndex = _.findIndex(
        newUnsavedItemUpdate,
        (item, index) => item._id == itemUpdate && itemUpdate._id
      );
      if (updateIndex >= 0) {
        newUnsavedItemUpdate[updateIndex] = itemUpdate;
      } else {
        newUnsavedItemUpdate.push(itemUpdate);
      }
      return _.assign({}, state, { unsavedItemUpdate: newUnsavedItemUpdate });
    },
    EMPTY_UNSAVED_ITEM_UPDATE: (state, action) => {
      return _.assign({}, state, { unsavedItemUpdate: [] });
    }
  },
  defaultState
);
export default reducer;

export const getUnsavedItemUpdate = state =>
  state.digitalMandi.unsavedItemUpdate;
