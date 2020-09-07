import { fetch_get, fetch_post } from "./fetch";

function getParents() {
  return fetch_get("getParents");
}

function addParent(user) {
  return fetch_post('addParent', {
    user
  })
}

function updateParent(user) {
  return fetch_post('updateParent', {
    user
  })
}

function removeParent(id) {
  return fetch_post('removeParent', {
    id
  })
}

export { getParents, addParent, updateParent, removeParent };
