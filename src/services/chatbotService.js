import { fetch_post } from "./fetch";

function getChatbots(course_id) {
  return fetch_post('getChatbots', {
    course_id
  })
}

function addChatbot(course_id, chatbot) {
  return fetch_post('addChatbot', {
    course_id,
    chatbot
  })
}

export { getChatbots, addChatbot }