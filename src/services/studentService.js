import { fetch_post } from "./fetch";

function getStudent(student_id) {
  return fetch_post('getStudent', {
    student_id
  })
}

function getStudents(text) {
  return fetch_post('getStudents', {
    text
  })
}

export { getStudent, getStudents }