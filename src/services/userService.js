import { fetch_get, fetch_post } from "./fetch";

function getUser() {
  return fetch_get('getUser')
}

function updatePassword(old_password, new_password) {
  return fetch_post('updatePassword', {
    old_password,
    new_password
  })
}

export { getUser, updatePassword }