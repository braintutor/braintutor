import { fetch_post } from "./fetch";

function getQuizzesByMaterial(material_id) {
  return fetch_post('getQuizzesByMaterial', {
    material_id
  })
}

function addQuiz(material_id, quiz) {
  return fetch_post('addQuiz', {
    material_id,
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

function getQuizResultByStudent(quiz_id) {
  return fetch_post('getQuizResultByStudent', {
    quiz_id
  })
}

export { addQuiz, getQuizzesByMaterial, updateQuiz, removeQuiz, setQuizResult, getQuizResultByStudent }