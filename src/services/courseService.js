
import { fetch_get, fetch_post } from "./fetch";


function getCourseByTeacher(course_id) {
  return fetch_post('getCourseByTeacher', {
    course_id
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

function updateCourseKnowledge(course_id, knowledge) {
  return fetch_post('updateCourseKnowledge', {
    course_id, knowledge
  })
}

function updateCourseAdaptive(course_id, adaptive) {
  return fetch_post('updateCourseAdaptive', {
    course_id, adaptive
  })
}

function removeCourse(id) {
  return fetch_post('removeCourse', {
    id
  })
}

export {
  getCourseByTeacher,
  getCoursesByTeacher,
  getCoursesBySchool,
  addCourse,
  updateCourse,
  updateCourseKnowledge,
  updateCourseAdaptive,
  removeCourse
}