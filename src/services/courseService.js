
import { fetch_get, fetch_post } from "./fetch";

function getCourses() {
  return fetch_get('getCourses')
}

function getCourse(course_id) {
  return fetch_post('getCourse', {
    course_id
  })
}

function getAllCourses() {
  return fetch_get('getAllCourses')
}

function updateCourse(course) {
  return fetch_post('updateCourse', {
    course
  })
}

export { getCourses, getCourse, getAllCourses, updateCourse }