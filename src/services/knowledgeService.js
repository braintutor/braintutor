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

function getKnowledgeByCourse(course_id) {
  return fetch_post('getKnowledgeByCourse', {
    course_id
  })
}

function updateKnowledgeByCourse(course_id, knowledge) {
  return fetch_post('updateKnowledgeByCourse', {
    course_id,
    knowledge
  })
}

export { getKnowledge, updateKnowledge, getKnowledgeByCourse, updateKnowledgeByCourse }