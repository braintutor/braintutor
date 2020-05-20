import { fetch_get, fetch_post } from "./fetch";

function getTeachersBySchool() {
  return fetch_get('getTeachersBySchool')
}

function getProfileTeacher() {
  return fetch_get('getProfileTeacher')
}

function addTeacher(teacher) {
  return fetch_post('addTeacher', {
    teacher
  })
}

function updateTeacher(teacher) {
  return fetch_post('updateTeacher', {
    teacher
  })
}

function removeTeacher(teacher_id) {
  return fetch_post('removeTeacher', {
    teacher_id
  })
}

export { getTeachersBySchool, getProfileTeacher, addTeacher, updateTeacher, removeTeacher }