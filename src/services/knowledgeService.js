import { fetch_post } from "./fetch";

function getKnowledge(chatbot_id) {
  return fetch_post('getKnowledge', {
    chatbot_id
  })
}

export { getKnowledge }