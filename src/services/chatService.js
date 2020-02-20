import { fetch_get, fetch_post } from "./fetch";

function train(chatbot_id) {
  return fetch_post('train', {
    chatbot_id
  })
}

function getAnswer(chatbot_id, question) {
  return fetch_post('getAnswer', {
    chatbot_id,
    question
  })
}

function getQuestionTemplate() {
  return fetch_get('getQuestionTemplate')
}

export { train, getAnswer, getQuestionTemplate }