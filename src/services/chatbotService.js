import { fetch_post } from "./fetch";

function getChatbots(course_id) {
  return fetch_post('getChatbots', {
    course_id
  })
}

function getChatbot(chatbot_id) {
  return fetch_post('getChatbot', {
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

export { getChatbot, getChatbots, addChatbot, updateChatbot }