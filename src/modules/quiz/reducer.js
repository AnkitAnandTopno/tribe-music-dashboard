import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  questions: []
};

export const { addQuestion, setQuestions, editQuestion } = createActions({
  ADD_QUESTION: question => question,
  SET_QUESTIONS: question => question,
  EDIT_QUESTION: question => question
});

// Reducer
const reducer = handleActions(
  {
    ADD_QUESTION: (state, action) => {
      let newQuestion = _.cloneDeep(state.questions);
      newQuestion.push(action.payload);
      return _.assign({}, state, { questions: newQuestion });
    },
    SET_QUESTIONS: (state, action) => {
      console.log(action.payload);
      return _.assign({}, state, { questions: action.payload });
    },
    EDIT_QUESTION: (state, action) => {
      let newQuestion = _.cloneDeep(state.questions);
      newQuestion[action.payload.index] = action.payload.event;
      return _.assign({}, state, { questions: newQuestion });
    }
  },
  defaultState
);
export default reducer;

export const getQuestions = state => state.quiz.questions;
