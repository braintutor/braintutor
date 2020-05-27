import { fetch_post } from "./fetch";

function addTask(session_id, task) {
  return fetch_post('addTask', {
    session_id,
    task
  })
}

function getTasksBySessionTeacher(session_id) {
  return fetch_post('getTasksBySessionTeacher', {
    session_id
  })
}

export { addTask, getTasksBySessionTeacher }