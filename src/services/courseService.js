
import { fetch_get } from "./fetch";

function getCourses() {
  return fetch_get('getCourses')
}

export { getCourses }