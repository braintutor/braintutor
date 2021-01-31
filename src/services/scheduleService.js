import { _fetchTemp } from "../api/helpers";
import { fetch_delete } from "./fetch";

function loadSchedule(body) {
  return _fetchTemp("POST", `api/v1/proposed-action/load`, body, false);
}

function deleteProposed(id) {
  return fetch_delete(`api/v1/proposed-action/${id}`);
}

export { loadSchedule, deleteProposed };
