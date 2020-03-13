import { fetch_post } from "./fetch";

function getStudent(student_id) {
  return fetch_post('getStudent', {
    student_id
  })
}

export { getStudent }