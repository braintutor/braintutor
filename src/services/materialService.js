import { fetch_post } from "./fetch";

function getMaterials(chatbot_id) {
  return fetch_post('getMaterials', {
    chatbot_id
  })
}

export { getMaterials }