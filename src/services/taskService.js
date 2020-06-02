import { fetch_post } from "./fetch";


function getTaskByStudent(task_id) {
  return fetch_post('getTaskByStudent', {
    task_id
  })
}

function getTasksBySessionTeacher(session_id) {
  return fetch_post('getTasksBySessionTeacher', {
    session_id
  })
}

function getTasksBySessionStudent(session_id) {
  return fetch_post('getTasksBySessionStudent', {
    session_id
  })
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

function updateTaskAnswer(task_id, answer) {
  return fetch_post('updateTaskAnswer', {
    task_id, 
    answer
  })
}

function removeTask(task_id) {
  return fetch_post('removeTask', {
    task_id
  })
}

export { getTaskByStudent, getTasksBySessionTeacher, getTasksBySessionStudent, addTask, updateTask, updateTaskAnswer, removeTask }