import { fetch_post } from "./fetch";

function login(email, password) {
  return fetch_post('login', {
    email, 
    password
  })
}

export { login }