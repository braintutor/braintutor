import { fetch_get, fetch_post } from "./fetch";

function getTasksBySession(session_id) {
  return fetch_post('getTasksBySession', {
    session_id
  })
}

function getTasksBySessionStudent(session_id) {
  return fetch_post('getTasksBySessionStudent', {
    session_id
  })
}

function getTasksByStudent() {
  return fetch_get('getTasksByStudent')
}

function addTask(session_id, task) {
  return fetch_post('addTask', {
    session_id,
    task
  })
}

function updateTask(task) {
  return fetch_post('updateTask', {
    task
  })
}

function removeTask(task_id) {
  return fetch_post('removeTask', {
    task_id
  })
}

export { getTasksBySession, getTasksBySessionStudent, getTasksByStudent, addTask, updateTask, removeTask }