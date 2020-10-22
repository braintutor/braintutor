import { fetch_post } from "./fetch";


function getTaskByStudent(id) {
  return fetch_post('getTaskByStudent', {
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

export { getTaskByStudent, addTask, updateTaskAnswer, removeTask }