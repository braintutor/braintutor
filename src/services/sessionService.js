import { fetch_get, fetch_post } from "./fetch";

function getSessionsBySchool() {
  return fetch_get('getSessionsBySchool')
}

function getSessionsByTeacher() {
  return fetch_get('getSessionsByTeacher')
}

function getSessionsByStudent() {
  return fetch_get('getSessionsByStudent')
}

function getSessionsByClassroom(classroom_id) {
  return fetch_post('getSessionsByClassroom', {
    classroom_id
  })
}

function addSession(session) {
  return fetch_post('addSession', {
    session
  })
}

function updateSession(session) {
  return fetch_post('updateSession', {
    session
  })
}

export { getSessionsBySchool, getSessionsByTeacher, getSessionsByStudent, getSessionsByClassroom, addSession, updateSession }