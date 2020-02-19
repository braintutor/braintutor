import { fetch_post } from "./fetch";

function getAnswer(chatbot_id, question) {
  return fetch_post('getAnswer', {
    chatbot_id,
    question
  })
}

export { getAnswer }