import { fetch_post } from "./fetch";

function getChatbot(course_id) {
  return fetch_post('obtenerTemaPorCurso', {
    curso_id: course_id
  })
}

export { getChatbot }