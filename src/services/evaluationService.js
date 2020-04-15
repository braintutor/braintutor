import { fetch_post } from "./fetch";

function getEvaluationsBySession(session_id) {
  return fetch_post('getEvaluationsBySession', {
    session_id
  })
}

function getEvaluation(evaluation_id) {
  return fetch_post('getEvaluation', {
    evaluation_id
  })
}

function getEvaluationsBySessionStudent(session_id) {
  return fetch_post('getEvaluationsBySessionStudent', {
    session_id
  })
}

function getEvaluationsBySessionDirector(session_id) {
  return fetch_post('getEvaluationsBySessionDirector', {
    session_id
  })
}

function addEvaluation(session_id, evaluation) {
  return fetch_post('addEvaluation', {
    session_id,
    evaluation
  })
}

function updateEvaluation(evaluation) {
  return fetch_post('updateEvaluation', {
    evaluation
  })
}

function publicEvaluation(evaluation_id) {
  return fetch_post('publicEvaluation', {
    evaluation_id
  })
}

function deleteEvaluation(evaluation_id) {
  return fetch_post('deleteEvaluation', {
    evaluation_id
  })
}

/*************************************************/

function startEvaluation(evaluation_id) {
  return fetch_post('startEvaluation', {
    evaluation_id
  })
}

function getResultByStudent(evaluation_id) {
  return fetch_post('getResultByStudent', {
    evaluation_id
  })
}

function setResult(evaluation_id, answers) {
  return fetch_post('setResult', {
    evaluation_id,
    answers
  })
}

function removeResult(evaluation_id, student_id) {
  return fetch_post('removeResult', {
    evaluation_id,
    student_id
  })
}

export {
  getEvaluationsBySession,
  getEvaluation,
  getEvaluationsBySessionStudent,
  getEvaluationsBySessionDirector,
  addEvaluation,
  updateEvaluation,
  publicEvaluation,
  deleteEvaluation,
  //
  startEvaluation,
  getResultByStudent,
  setResult,
  removeResult
}