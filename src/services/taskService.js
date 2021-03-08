import { fetch_post } from "./fetch";





function getTask(id) {
  return fetch_post('getTaskById', {
    id
  })
}

function addTask(session_id, task) {
  return fetch_post('addTask', {
    session_id,
    task
  })
}

function updateTaskAnswer(id, answer) {
  return fetch_post('updateTaskAnswer', {
    id,
    answer
  })
}

function removeTask(task_id) {
  return fetch_post('removeTask', {
    task_id
  })
}

export { getTask, addTask, updateTaskAnswer, removeTask }