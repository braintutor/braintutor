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

function getStudentsBySessionStudent(session_id) {
  return fetch_post('getStudentsBySessionStudent', {
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

function updateStudentTime() {
  return fetch_get('updateStudentTime')
}

function removeStudent(student_id, key) {
  return fetch_post('removeStudent', {
    student_id, key
  })
}

function getProfileStudent() {
  return fetch_get('getProfileStudent')
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
  getStudentsBySessionStudent,
  addStudent,
  updateStudent,
  updateStudentTime,
  removeStudent,
  getProfileStudent,
  updateLearningStyle,
  getCategoriesByLearningStyle
}