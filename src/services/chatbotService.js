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

function getChatbotName(chatbot_id) {
  return fetch_post('getChatbotName', {
    chatbot_id
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

function removeChatbot(chatbot_id) {
  return fetch_post('removeChatbot', {
    chatbot_id
  })
}

export { getChatbot, getChatbotsByCourse, getChatbotsBySession, getChatbotName, addChatbot, updateChatbot, removeChatbot }