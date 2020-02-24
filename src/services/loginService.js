import { fetch_post } from "./fetch";

function loginTeacher(user, pass) {
  return fetch_post('loginTeacher', {
    user,
    pass
  })
}

function loginStudent(user, pass) {
  return fetch_post('loginStudent', {
    user,
    pass
  })
}

export { loginTeacher, loginStudent }