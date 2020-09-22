import { fetch_get, fetch_post } from "./fetch";

function train(unit_id) {
  return fetch_post("train", {
    unit_id,
  });
}

function getAnswer(unit_id, question) {
  return fetch_post("getAnswer", {
    unit_id,
    question,
  });
}

function getQuestionTemplate() {
  return fetch_get("getQuestionTemplate");
}

export { train, getAnswer, getQuestionTemplate };
