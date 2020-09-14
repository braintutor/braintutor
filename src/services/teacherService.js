import { fetch_get, fetch_post } from "./fetch";

function getTeachersBySchool() {
  return fetch_get('getTeachersBySchool')
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

function removeTeacher(_id) {
  return fetch_post('removeTeacher', {
    _id
  })
}

export { getTeachersBySchool, addTeacher, updateTeacher, removeTeacher }