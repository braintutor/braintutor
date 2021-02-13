import { _fetchTemp } from "../api/helpers";
import { fetch_delete, fetch_get } from "./fetch";

function loadSchedule(body) {
  return _fetchTemp("POST", `api/v1/proposed-action/load`, body, false);
}

function deleteProposed(id) {
  return fetch_delete(`api/v1/proposed-action/${id}`);
}

function getAllSessions() {
  return fetch_get(`api/v2/session`);
}

export { loadSchedule, deleteProposed, getAllSessions };
