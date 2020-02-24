
import { fetch_get } from "./fetch";

function getCourses() {
  return fetch_get('getCourses')
}

function getAllCourses() {
  return fetch_get('getAllCourses')
}

export { getCourses, getAllCourses }