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