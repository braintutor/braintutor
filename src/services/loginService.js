import { fetch_post } from "./fetch";

function login(school_id, user, pass) {
  return fetch_post('login', {
    school_id,
    user,
    pass
  })
}

export { login }