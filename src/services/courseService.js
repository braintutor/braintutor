
import { fetch_post } from "./fetch";
import { getSession } from './security'

function getCourses() {
  let token = getSession().token
  return fetch_post('obtenerCursoPorProfesor', {
    profesor_id: token
  })
}

export { getCourses }