import { fetch_put } from "./fetch";

export function scoreEvaluation(result_id, score) {
    return fetch_put(`api/v1/evaluation-result/${result_id}/score`, { score })
}
  