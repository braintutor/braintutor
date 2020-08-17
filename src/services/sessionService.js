import { fetch_get, fetch_post } from "./fetch";

function getSessionByTeacher(session_id) {
  return fetch_post("getSessionByTeacher", {
    session_id,
  });
}

function getSessionByStudent(session_id) {
  return fetch_post("getSessionByStudent", {
    session_id,
  });
}

function getSessionsBySchool() {
  return fetch_get("getSessionsBySchool");
}

function getSessionsByTeacher() {
  return fetch_get("getSessionsByTeacher");
}

function getSessionsByStudent() {
  return fetch_get("getSessionsByStudent");
}

function getSessionsByClassroom(classroom_id) {
  return fetch_post("getSessionsByClassroom", {
    classroom_id,
  });
}

function getSessionsEventsAndTaksByStudent() {
  return fetch_get("getSessionsEventsAndTaksByStudent");
}

function addSession(session) {
  return fetch_post("addSession", {
    session,
  });
}

function updateSession(session) {
  return fetch_post("updateSession", {
    session,
  });
}

export {
  getSessionByTeacher,
  getSessionByStudent,
  getSessionsBySchool,
  getSessionsByTeacher,
  getSessionsByStudent,
  getSessionsByClassroom,
  getSessionsEventsAndTaksByStudent,
  addSession,
  updateSession,
};
