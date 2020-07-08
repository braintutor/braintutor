import { fetch_get, fetch_post } from "./fetch";

function getDirector() {
  return fetch_get('getDirector')
}

function updateDirector(director) {
  return fetch_post('updateDirector', {
    director
  })
}

export { getDirector, updateDirector }