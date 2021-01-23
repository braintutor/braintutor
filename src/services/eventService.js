import { fetch_post, fetch_get } from "./fetch";

function getEventsBySession(session_id) {
  return fetch_post("getEventsBySession", {
    session_id,
  });
}

function getEventsBySessionStudent(session_id) {
  return fetch_post("getEventsBySessionStudent", {
    session_id,
  });
}

function addEvent(session_id, event) {
  return fetch_post("addEvent", {
    session_id,
    event,
  });
}

function updateEvent(event) {
  return fetch_post("updateEvent", {
    event,
  });
}

function removeEvent(event_id) {
  return fetch_post("removeEvent", {
    event_id,
  });
}

var randomColor = require('randomcolor');

function generateColor(text){
  return text.length > 20? randomColor({
    seed: text
  }) : text

}
function getEvents(rangeDate){
  return fetch_get(`event2?startDate=${rangeDate.startDate}&endDate=${rangeDate.endDate}`)
}

export {
  getEvents,
  generateColor,
  getEventsBySession,
  getEventsBySessionStudent,
  addEvent,
  updateEvent,
  removeEvent,
};
