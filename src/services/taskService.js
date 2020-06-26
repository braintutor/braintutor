import { fetch_post } from "./fetch";


function getTaskByStudent(id) {
  return fetch_post('getTaskByStudent', {
    id
  })
}

function getTasksBySessionTeacher(session_id) {
  return fetch_post('getTasksBySessionTeacher', {
    session_id
  })
}

function getTasksBySessionStudent(id) {
  return fetch_post('getTasksBySessionStudent', {
    id
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

export { getTaskByStudent, getTasksBySessionTeacher, getTasksBySessionStudent, addTask, updateTask, updateTaskAnswer, removeTask }