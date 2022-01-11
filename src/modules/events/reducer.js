import { createActions, handleActions } from "redux-actions";
import _ from "lodash";
const defaultState = {
  events: []
};

export const { addEvent, setEvents, editEvent } = createActions({
  ADD_EVENT: event => {
    console.log(event);
    return event;
  },
  SET_EVENTS: events => events,
  EDIT_EVENT: event => event
});

// Reducer
const reducer = handleActions(
  {
    ADD_EVENT: (state, action) => {
      let newEvent = _.cloneDeep(state.events);
      newEvent.push(action.payload);
      return _.assign({}, state, { events: newEvent });
    },
    SET_EVENTS: (state, action) => {
      console.log(action.payload);
      return _.assign({}, state, { events: action.payload });
    },
    EDIT_EVENT: (state, action) => {
      let newEvent = _.cloneDeep(state.events);
      newEvent[action.payload.index] = action.payload.event;
      return _.assign({}, state, { events: newEvent });
    }
  },
  defaultState
);
export default reducer;

export const getEvents = state => state.events.events;
