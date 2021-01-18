import { fetch_put, fetch_get } from "./fetch";

export function scoreEvaluation(result_id, score) {
    return fetch_put(`api/v1/evaluation-result/${result_id}/score`, { score })
}

export function publishScores(studentEvaluationIds) {
    return fetch_put(`api/v1/evaluation-result/score/publish`, { student_evaluation_ids: studentEvaluationIds })
}

export function getStudentEvaluation(id) {
    return fetch_get(`api/v1/evaluation-result/${id}`)
}
