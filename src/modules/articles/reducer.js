import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  articles: []
};

export const { addArticles, setArticles } = createActions({
  ADD_ARTICLES: article => article,
  SET_ARTICLES: articles => articles
});

// Reducer
const reducer = handleActions(
  {
    ADD_ARTICLES: (state, action) => {
      let newArticle = _.cloneDeep(state.articles);
      newArticle.push(action.payload);
      return _.assign({}, state, { articles: newArticle });
    },
    SET_ARTICLES: (state, action) => {
      console.log(action.payload);
      return _.assign({}, state, { articles: action.payload });
    }
  },
  defaultState
);
export default reducer;

export const getArticles = state => state.articles.articles;
