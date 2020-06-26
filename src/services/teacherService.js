import { fetch_get, fetch_post } from "./fetch";

function getTeachersBySchool() {
  return fetch_get('getTeachersBySchool')
}

function getProfileTeacher() {
  return fetch_get('getProfileTeacher')
}

function addTeacher(user) {
  return fetch_post('addTeacher', {
    user
  })
}

function updateTeacher(user) {
  return fetch_post('updateTeacher', {
    user
  })
}

function removeTeacher(id) {
  return fetch_post('removeTeacher', {
    id
  })
}

export { getTeachersBySchool, getProfileTeacher, addTeacher, updateTeacher, removeTeacher }