import { fetch_post } from "./fetch";

function updateCourseKnowledge(course_id, knowledge) {
  return fetch_post('updateCourseKnowledge', {
    course_id, knowledge
  })
}

export { updateCourseKnowledge }