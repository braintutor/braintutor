import { fetch_get, fetch_post } from "./fetch";

function getClassroomsBySchool() {
  return fetch_get('getClassroomsBySchool')
}

function getClassroomsBySchoolDirector() {
  return fetch_get('getClassroomsBySchoolDirector')
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

function removeClassroom(classroom_id) {
  return fetch_post('removeClassroom', {
    classroom_id
  })
}

export { getClassroomsBySchool, getClassroomsBySchoolDirector, addClassroom, updateClassroom, removeClassroom }