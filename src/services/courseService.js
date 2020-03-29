
import { fetch_get, fetch_post } from "./fetch";

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

export { getCoursesByTeacher, getCoursesBySchool, addCourse, updateCourse }