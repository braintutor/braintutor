import { fetch_post } from "./fetch";

function getTasks(course_id) {
  return fetch_post('getTasks', {
    course_id
  })
}

function addTask(course_id, task) {
  return fetch_post('addTask', {
    course_id,
    task
  })
}

function updateTasks(course_id, tasks) {
  return fetch_post('updateTasks', {
    course_id,
    tasks
  })
}

function removeTask(task_id) {
  return fetch_post('removeTask', {
    task_id
  })
}

export { getTasks, addTask, updateTasks, removeTask }