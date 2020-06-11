import { fetch_post } from "./fetch";

function getChatbotToken(chatbot_id) {
  return fetch_post('getChatbotToken', {
    chatbot_id
  })
}

export { getChatbotToken }