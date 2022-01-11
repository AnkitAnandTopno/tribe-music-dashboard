import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  songs: []
};

export const { addSong, setSongs, editSong, playSong, pauseSong, addPlayer } = createActions({
  ADD_SONG: song => song,
  SET_SONGS: song => song,
  EDIT_SONG: song => song,
  PLAY_SONG: song => song,
  PAUSE_SONG: ()=>{},
  ADD_PLAYER: player => player
});

// Reducer
const reducer = handleActions(
  {
    ADD_SONG: (state, action) => {
      let newSong = _.cloneDeep(state.songs);
      newSong.push(action.payload);
      return _.assign({}, state, { songs: newSong });
    },
    SET_SONGS: (state, action) => {
      return _.assign({}, state, { songs: action.payload });
    },
    EDIT_SONG: (state, action) => {
      let newSong = _.cloneDeep(state.songs);
      newSong[action.payload.index] = action.payload.event;
      return _.assign({}, state, { songs: newSong });
    },
    PLAY_SONG: (state, action) => {
      let newPayload = action.payload?{song: action.payload, isPlaying: true}:{isPlaying: true};
      return _.assign({}, state, newPayload);
    },
    PAUSE_SONG: (state, action) => {
      
      return _.assign({}, state, { isPlaying: false});
    },
    ADD_PLAYER: (state, action) => {
      
      return _.assign({}, state, { player: action.payload});
    }
  },
  defaultState
);
export default reducer;

export const getSongs = state => state.songs.songs;
export const getSong = state => state.songs.song;
export const isPlaying = state => state.songs.isPlaying;
export const getPlayer = state=> state.songs.player;
