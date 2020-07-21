import { fetch_post } from "./fetch";

function getChatbotsByCourseTeacher(course_id) {
  return fetch_post('getChatbotsByCourseTeacher', {
    course_id
  })
}

function getChatbotsByCourseStudent(course_id) {
  return fetch_post('getChatbotsByCourseStudent', {
    course_id
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
  getChatbotsByCourseStudent,
  getChatbotsAndMaterials,
  addChatbot,
  updateChatbot,
  updateChatbotOrder,
  removeChatbot
}