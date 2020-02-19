import { fetch_post } from "./fetch";

function getChatbots(course_id) {
  return fetch_post('getChatbots', {
    course_id
  })
}

export { getChatbots }