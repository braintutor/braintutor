import { fetch_post } from "./fetch";

function getQuizzes(chatbot_id) {
  return fetch_post('getQuizzes', {
    chatbot_id
  })
}

export { getQuizzes }