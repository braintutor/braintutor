import { fetch_get, fetch_post } from "./fetch";

function getStudent(student_id) {
  return fetch_post('getStudent', {
    student_id
  })
}

function getStudents() {
  return fetch_get('getStudents')
}

function getStudentsByText(text) {
  return fetch_post('getStudentsByText', {
    text
  })
}

function getStudentsByClassroom(classroom_id) {
  return fetch_post('getStudentsByClassroom', {
    classroom_id
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

function getProfile() {
  return fetch_get('getProfile')
}

function updateLearningStyle(learning_style) {
  return fetch_post('updateLearningStyle', {
    learning_style
  })
}

function getCategoriesByLearningStyle() {
  return fetch_get('getCategoriesByLearningStyle')
}

export {
  getStudent,
  getStudents,
  getStudentsByText,
  getStudentsByClassroom,
  addStudent,
  updateStudent,
  getProfile,
  updateLearningStyle,
  getCategoriesByLearningStyle
}