import { combineReducers } from "redux";
import Events from "./events/reducer.js";
import Quiz from "./quiz/reducer.js";
import Articles from "./articles/reducer.js";
// import songs from "./songs/reducer.js";
import auth from "./auth/reducer.js";
import BibleStudy from "./bibleStudy/reducer.js";
import OnlineChurch from "./onlineChurch/reducer.js";
import Songs from "./songs/reducer.js";
//digital mandi reducers below
import DigitalMandi from "./digitalMandi/reducer.js";
const allReducers = combineReducers({
  quiz: Quiz,
  articles: Articles,
  events: Events,
  auth: auth,
  bibleStudy: BibleStudy,
  onlineChurch: OnlineChurch,
  songs: Songs,
  digitalMandi: DigitalMandi
});
export default allReducers;
