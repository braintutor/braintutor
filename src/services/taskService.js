import { fetch_post } from "./fetch";

function getTasks(chatbot_id) {
  return fetch_post('getTasks', {
    chatbot_id
  })
}

function addTask(chatbot_id, task) {
  return fetch_post('addTask', {
    chatbot_id,
    task
  })
}

function updateTasks(chatbot_id, tasks) {
  return fetch_post('updateTasks', {
    chatbot_id,
    tasks
  })
}

function removeTask(task_id) {
  return fetch_post('removeTask', {
    task_id
  })
}

export { getTasks, addTask, updateTasks, removeTask }