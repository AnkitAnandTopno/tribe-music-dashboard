import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  bibleStudy: []
};

export const { addBibleStudy, setBibleStudy, editBibleStudy } = createActions({
  ADD_BIBLE_STUDY: bibleStudy => bibleStudy,
  SET_BIBLE_STUDY: bibleStudy => bibleStudy,
  EDIT_BIBLE_STUDY: bibleStudy => bibleStudy
});

// Reducer
const reducer = handleActions(
  {
    ADD_BIBLE_STUDY: (state, action) => {
      let newBibleStudy = _.cloneDeep(state.bibleStudy);
      newBibleStudy.push(action.payload);
      return _.assign({}, state, { bibleStudy: newBibleStudy });
    },
    SET_BIBLE_STUDY: (state, action) => {
      console.log(action.payload);
      return _.assign({}, state, { bibleStudy: action.payload });
    },
    EDIT_BIBLE_STUDY: (state, action) => {
      let newBibleStudy = _.cloneDeep(state.questions);
      newBibleStudy[action.payload.index] = action.payload.bibleStudy;
      return _.assign({}, state, { bibleStudy: newBibleStudy });
    }
  },
  defaultState
);
export default reducer;

export const getBibleStudy = state => state.bibleStudy.bibleStudy;
