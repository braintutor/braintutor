import { fetch_post } from "./fetch";

function getKnowledge(chatbot_id) {
  return fetch_post('getKnowledge', {
    chatbot_id
  })
}

function updateKnowledge(chatbot_id, knowledge) {
  return fetch_post('updateKnowledge', {
    chatbot_id,
    knowledge
  })
}

function removeKnowledge(chatbot_id, knowledge_ids) {
  return fetch_post('removeKnowledge', {
    chatbot_id,
    knowledge_ids
  })
}

export { getKnowledge, updateKnowledge, removeKnowledge }