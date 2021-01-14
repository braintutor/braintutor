import { fetch_post } from "./fetch";

function getEvaluationsBySession(session_id) {
  return fetch_post('getEvaluationsBySession', {
    session_id
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

function updateEvaluationByTeacher(evaluation) {
  return fetch_post('updateEvaluationByTeacher', {
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

function later(delay) {
  return new Promise(function(resolve) {
      setTimeout(resolve, delay);
  });
}

function scoreEvaluation(evaluation_id, student_id, score) {
  // return fetch_post('scoreEvaluation', {
  //   student_id,
  //   score
  // })
  return later(1000).then(() => ({ student: { name: "hello", _id: student_id, score: score, evaluation_id}}))
}

export {
  getEvaluationsBySession,
  getEvaluationsBySessionStudent,
  getEvaluationsBySessionDirector,
  addEvaluation,
  updateEvaluationByTeacher,
  publicEvaluation,
  deleteEvaluation,
  //
  getEvaluationByStudent,
  getResultByStudent,
  updateEvaluationAnswers,
  finishEvaluation,
  removeResult,

  scoreEvaluation
}