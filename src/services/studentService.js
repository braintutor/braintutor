import { fetch_get, fetch_post } from "./fetch";

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

function getStudentsByClassroomDirector(classroom_id) {
  return fetch_post('getStudentsByClassroomDirector', {
    classroom_id
  })
}

function getStudentsBySession(session_id) {
  return fetch_post('getStudentsBySession', {
    session_id
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
  getStudents,
  getStudentsByText,
  getStudentsByClassroom,
  getStudentsByClassroomDirector,
  getStudentsBySession,
  addStudent,
  updateStudent,
  getProfile,
  updateLearningStyle,
  getCategoriesByLearningStyle
}