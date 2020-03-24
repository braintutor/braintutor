
import { fetch_get, fetch_post } from "./fetch";

function getCourses() {
  return fetch_get('getCourses')
}

function getCoursesBySchool() {
  return fetch_get('getCoursesBySchool')
}

function getCourse(course_id) {
  return fetch_post('getCourse', {
    course_id
  })
}

function getAllCourses() {
  return fetch_get('getAllCourses')
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

function addStudentToCourse(course_id, student_id) {
  return fetch_post('addStudentToCourse', {
    course_id,
    student_id
  })
}

function removeStudent(course_id, student_id) {
  return fetch_post('removeStudent', {
    course_id,
    student_id
  })
}

export { getCourses, getCoursesBySchool, getCourse, getAllCourses, addCourse, updateCourse, addStudentToCourse, removeStudent }