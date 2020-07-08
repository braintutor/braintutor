import { fetch_get, fetch_post } from "./fetch";

function getUser() {
  return fetch_get('getUser')
}

function updatePassword(current_password, new_password) {
  return fetch_post('updatePassword', {
    current_password,
    new_password
  })
}

function updatePasswordByAdmin(id, password) {
  return fetch_post('updatePasswordByAdmin', {
    id, password
  })
}

function generatePassword() {
  return Math.random().toString(36).slice(-8).toUpperCase()
}

export { getUser, updatePassword, updatePasswordByAdmin, generatePassword }