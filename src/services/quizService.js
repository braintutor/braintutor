import { fetch_post } from "./fetch";

function getQuizzes(chatbot_id) {
  return fetch_post('getQuizzes', {
    chatbot_id
  })
}

function addQuiz(chatbot_id, quiz) {
  return fetch_post('addQuiz', {
    chatbot_id,
    quiz
  })
}

function updateQuiz(quiz) {
  return fetch_post('updateQuiz', {
    quiz
  })
}

function removeQuiz(quiz_id) {
  return fetch_post('removeQuiz', {
    quiz_id
  })
}

export { addQuiz, getQuizzes, updateQuiz, removeQuiz }