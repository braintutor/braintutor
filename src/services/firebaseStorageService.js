import { fetch_post } from "./fetch";

function getCourseToken(course_id) {
  return fetch_post('getCourseToken', {
    course_id
  })
}

export { getCourseToken }