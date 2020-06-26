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

function getEvaluationsBySessionStudent(id) {
  return fetch_post('getEvaluationsBySessionStudent', {
    id
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

function getEvaluationByStudent(evaluation_id) {
  return fetch_post('getEvaluationByStudent', {
    evaluation_id 
  })
}

function getResultByStudent(evaluation_id) {
  return fetch_post('getResultByStudent', {
    evaluation_id
  })
}

function updateEvaluationAnswers(evaluation_id, answers) {
  return fetch_post('updateEvaluationAnswers', {
    evaluation_id,
    answers
  })
}

function finishEvaluation(evaluation_id) {
  return fetch_post('finishEvaluation', {
    evaluation_id
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
  getEvaluationByStudent,
  getResultByStudent,
  updateEvaluationAnswers,
  finishEvaluation,
  removeResult
}