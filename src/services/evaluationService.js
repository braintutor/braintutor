import { fetch_post, fetch_get, fetch_put, fetch_delete} from "./fetch";

function getEvaluationsBySession(session_id) {
  return fetch_get(`api/v1/evaluation2?session_id=${session_id}`)
}

function getEvaluationsBySessionStudent(id) {
  return fetch_post('getEvaluationsBySessionStudent', {
    id
  })
}

function addEvaluation(session_id, evaluation) {
  return fetch_post('api/v1/evaluation2', {
    session_id,
    evaluation
  })
}

function updateEvaluationByTeacher(evaluation) {
  return fetch_put('api/v1/evaluation2', {
    evaluation
  })
}

function publicEvaluation(evaluation_id) {
  return fetch_post(`api/v1/evaluation2/${evaluation_id}/publish`, {
  })
}

function deleteEvaluation(evaluation_id) {
  return fetch_delete(`api/v1/evaluation2/${evaluation_id}`)
}

/*************************************************/

function getEvaluationByStudent(evaluation_id) {
  return fetch_post(`api/v1/evaluation2/${evaluation_id}/take`, {})
}

function getResultByStudent(evaluation_id) {
  return fetch_post('getResultByStudent', {
    evaluation_id
  })
}

function updateEvaluationAnswers(evaluation_id, answers) {
  return fetch_post(`api/v1/evaluation2/${evaluation_id}/answer`, {
    answers
  })
}

function finishEvaluation(evaluation_id) {
  return fetch_post(`api/v1/evaluation2/${evaluation_id}/finish`, {
  })
}

function removeResult(evaluation_id, student_id) {
  return fetch_delete(`api/v1/evaluation2/${evaluation_id}/result/${student_id}`)
}

function getResults(evaluation_id) {
  return fetch_get(`api/v1/evaluation2/evaluation-result/${evaluation_id}`)
}

export {
  getEvaluationsBySession,
  getEvaluationsBySessionStudent,
  addEvaluation,
  updateEvaluationByTeacher,
  publicEvaluation,
  deleteEvaluation,
  getEvaluationByStudent,
  getResultByStudent,
  updateEvaluationAnswers,
  finishEvaluation,
  removeResult,
  getResults
}