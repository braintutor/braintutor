import { fetch_get, fetch_post } from "./fetch";

function getClassrooms() {
  return fetch_get('getClassrooms')
}

function addClassroom(classroom) {
  return fetch_post('addClassroom', {
    classroom
  })
}

function updateClassroom(classroom) {
  return fetch_post('updateClassroom', {
    classroom
  })
}

export { getClassrooms, addClassroom, updateClassroom }