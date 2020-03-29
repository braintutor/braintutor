import { fetch_post } from "./fetch";

function getTasksBySession(session_id) {
  return fetch_post('getTasksBySession', {
    session_id
  })
}

function addTask(session_id, task) {
  return fetch_post('addTask', {
    session_id,
    task
  })
}

function updateTasks(session_id, tasks) {
  return fetch_post('updateTasks', {
    session_id,
    tasks
  })
}

function removeTask(task_id) {
  return fetch_post('removeTask', {
    task_id
  })
}

export { getTasksBySession, addTask, updateTasks, removeTask }