import { fetch_post } from "./fetch";

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

export {
  getEventsBySession,
  getEventsBySessionStudent,
  addEvent,
  updateEvent,
  removeEvent,
};
