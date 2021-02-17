import { fetch_get, fetch_post, fetch_put, fetch_delete } from "./fetch";

function index() {
  return fetch_get("api/v1/subject");
}
function add(payload) {
  return fetch_post(`api/v1/subject`, payload);
}
function update(id, payload) {
  return fetch_put(`api/v1/subject/${id}`, payload);
}
function remove(id) {
  return fetch_delete(`api/v1/subject/${id}`);
}

export { index, add, update, remove };
