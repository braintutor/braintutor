import { fetch_post } from "./fetch";

function login(school_id, username, password) {
  return fetch_post('login', {
    school_id,
    username,
    password
  })
}

export { login }