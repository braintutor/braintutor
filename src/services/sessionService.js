import { fetch_get, fetch_post } from "./fetch";

function getSessionsBySchool() {
  return fetch_get('getSessionsBySchool')
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

export { getSessionsBySchool, addSession, updateSession }