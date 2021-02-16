import { fetch_get } from "./fetch";

function index() {
  return fetch_get('api/v1/subject')
}


export { index }