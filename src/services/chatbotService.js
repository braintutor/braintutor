import { fetch_post } from "./fetch";

function getChatbotsByCourse(course_id) {
  return fetch_post('getChatbotsByCourse', {
    course_id
  })
}

function getChatbotsBySession(session_id) {
  return fetch_post('getChatbotsBySession', {
    session_id
  })
}

function getChatbot(chatbot_id) {
  return fetch_post('getChatbot', {
    chatbot_id
  })
}

function getChatbotNameOrder(chatbot_id) {
  return fetch_post('getChatbotNameOrder', {
    chatbot_id
  })
}

function getChatbotsAndMaterials(course_id) {
  return fetch_post('getChatbotsAndMaterials', {
    course_id
  })
}

function addChatbot(course_id, chatbot) {
  return fetch_post('addChatbot', {
    course_id,
    chatbot
  })
}

function updateChatbot(chatbot) {
  return fetch_post('updateChatbot', {
    chatbot
  })
}

function updateChatbotOrder(id, order) {
  return fetch_post('updateChatbotOrder', {
    id,
    order
  })
}

function removeChatbot(id) {
  return fetch_post('removeChatbot', {
    id
  })
}

export {
  getChatbot,
  getChatbotsByCourse,
  getChatbotsBySession,
  getChatbotNameOrder,
  getChatbotsAndMaterials,
  addChatbot,
  updateChatbot,
  updateChatbotOrder,
  removeChatbot
}