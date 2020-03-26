import { fetch_get, fetch_post } from "./fetch";

function getClassroomsBySchool() {
  return fetch_get('getClassroomsBySchool')
}

function addClassroom(classroom) {
  return fetch_post('addClassroom', {
    classroom
  })
}

function updateClassroom(classroom) {
  return fetch_post('updateClassroom', {
    classroom
  })
}

export { getClassroomsBySchool, addClassroom, updateClassroom }