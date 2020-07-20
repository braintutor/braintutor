import { fetch_post } from "./fetch";

function getChatbotsByCourse(course_id) {
  return fetch_post('getChatbotsByCourse', {
    course_id
  })
}

function getChatbotsByCourseTeacher(course_id) {
  return fetch_post('getChatbotsByCourseTeacher', {
    course_id
  })
}

function getChatbotsBySession(session_id) {
  return fetch_post('getChatbotsBySession', {
    session_id
  })
}

function getChatbotAndMaterialsByTeacher(chatbot_id) {
  return fetch_post('getChatbotAndMaterialsByTeacher', {
    chatbot_id
  })
}

function getChatbotAndMaterialsByStudent(chatbot_id) {
  return fetch_post('getChatbotAndMaterialsByStudent', {
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
  getChatbotsByCourseTeacher,
  getChatbotAndMaterialsByTeacher,
  getChatbotAndMaterialsByStudent,
  getChatbotsByCourse,
  getChatbotsBySession,
  getChatbotsAndMaterials,
  addChatbot,
  updateChatbot,
  updateChatbotOrder,
  removeChatbot
}