
import { fetch_get, fetch_post } from "./fetch";

function getCourseIdByChatbot(chatbot_id) {
  return fetch_post('getCourseIdByChatbot', {
    chatbot_id
  })
}

function getCourseByTeacher(course_id) {
  return fetch_post('getCourseByTeacher', {
    course_id
  })
}

function getCourseByStudent(course_id) {
  return fetch_post('getCourseByStudent', {
    course_id
  })
}

function getCourseNameBySession(session_id) {
  return fetch_post('getCourseNameBySession', {
    session_id
  })
}

function getCoursesByTeacher() {
  return fetch_get('getCoursesByTeacher')
}

function getCoursesBySchool() {
  return fetch_get('getCoursesBySchool')
}

function getCourseByMaterial(material_id) {
  return fetch_post('getCourseByMaterial', {
    material_id
  })
}

function addCourse(course) {
  return fetch_post('addCourse', {
    course
  })
}

function updateCourse(course) {
  return fetch_post('updateCourse', {
    course
  })
}

function removeCourse(id) {
  return fetch_post('removeCourse', {
    id
  })
}

export {
  getCourseIdByChatbot,
  getCourseByTeacher,
  getCourseByStudent,
  getCourseNameBySession,
  getCoursesByTeacher,
  getCoursesBySchool,
  getCourseByMaterial,
  addCourse,
  updateCourse,
  removeCourse
}