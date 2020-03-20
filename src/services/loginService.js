import { fetch_post } from "./fetch";

function loginAdmin(school_id, user, pass) {
  return fetch_post('loginAdmin', {
    school_id,
    user,
    pass
  })
}

function loginTeacher(school_id, user, pass) {
  return fetch_post('loginTeacher', {
    school_id,
    user,
    pass
  })
}

function loginStudent(school_id, user, pass) {
  return fetch_post('loginStudent', {
    school_id,
    user,
    pass
  })
}

export { loginAdmin, loginTeacher, loginStudent }