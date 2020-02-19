import { fetch_post } from "./fetch";

function loginTeacher(user, pass) {
  return fetch_post('loginTeacher', {
    user,
    pass
  })
}

export { loginTeacher }