import { fetch_get, fetch_post } from "./fetch";

function getStudents() {
  return fetch_get('getStudents')
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


function addStudent(user) {
  return fetch_post('addStudent', {
    user
  })
}

function updateStudent(user) {
  return fetch_post('updateStudent', {
    user
  })
}

function updateStudentTime() {
  return fetch_get('updateStudentTime')
}

function removeStudent(id, key) {
  return fetch_post('removeStudent', {
    id, key
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