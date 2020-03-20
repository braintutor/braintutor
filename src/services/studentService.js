import { fetch_post } from "./fetch";

function getStudent(student_id) {
  return fetch_post('getStudent', {
    student_id
  })
}

function getStudents(school_id) {
  return fetch_post('getStudents', {
    school_id
  })
}

function getStudentsByText(text) {
  return fetch_post('getStudentsByText', {
    text
  })
}

function addStudent(student) {
  return fetch_post('addStudent', {
    student
  })
}

function updateStudent(student) {
  return fetch_post('updateStudent', {
    student
  })
}

export { getStudent, getStudents, getStudentsByText, addStudent, updateStudent }