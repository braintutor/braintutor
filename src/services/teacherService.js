import { fetch_get, fetch_post } from "./fetch";

function getTeachers() {
  return fetch_get('getTeachers')
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

export { getTeachers, addTeacher, updateTeacher }