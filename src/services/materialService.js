import { fetch_get, fetch_post } from "./fetch";

function getMaterials(chatbot_id) {
  return fetch_post('getMaterials', {
    chatbot_id
  })
}

function getQuestionTemplate() {
  return fetch_get('getQuestionTemplate')
}

export { getMaterials, getQuestionTemplate }