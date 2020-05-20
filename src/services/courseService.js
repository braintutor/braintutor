
import { fetch_get, fetch_post } from "./fetch";

function getCourseIdByChatbot(chatbot_id) {
  return fetch_post('getCourseIdByChatbot', {
    chatbot_id
  })
}

function getCourseName(course_id) {
  return fetch_post('getCourseName', {
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

function removeCourse(course_id) {
  return fetch_post('removeCourse', {
    course_id
  })
}

export { 
  getCourseIdByChatbot, 
  getCourseName, 
  getCourseNameBySession, 
  getCoursesByTeacher, 
  getCoursesBySchool, 
  addCourse, 
  updateCourse ,
  removeCourse
}