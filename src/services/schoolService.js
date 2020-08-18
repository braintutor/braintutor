import { fetch_get, fetch_post } from "./fetch";

function getSchool() {
  return fetch_get('getSchool')
}

function getSchoolByURL(url) {
  return fetch_post('getSchoolByURL', {
    url
  })
}

function updateSchool(school) {
  return fetch_post('updateSchool', {
    school
  })
}

export { getSchool, getSchoolByURL, updateSchool }