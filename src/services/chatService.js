import { fetch_get, fetch_post } from "./fetch";

function getAnswer(chatbot_id, question) {
  return fetch_post('getAnswer', {
    chatbot_id,
    question
  })
}

function getQuestionTemplate() {
  return fetch_get('getQuestionTemplate')
}

export { getAnswer, getQuestionTemplate }