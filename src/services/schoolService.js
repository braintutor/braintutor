import { fetch_get, fetch_post } from "./fetch";

function getSchool() {
  return fetch_get('getSchool')
}

function getSchoolByUser(school_user) {
  return fetch_post('getSchoolByUser' ,{
    school_user
  })
}

function getSchools() {
  return fetch_get('getSchools')
}

function updateSchool(school) {
  return fetch_post('updateSchool', {
    school
  })
}

export { getSchool, getSchoolByUser, getSchools, updateSchool }