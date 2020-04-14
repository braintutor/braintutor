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

function setQuizResult(quiz_id, result) {
  return fetch_post('setQuizResult', {
    quiz_id, 
    result
  })
}

export { addQuiz, getQuizzes, updateQuiz, removeQuiz, setQuizResult }