import { fetch_post } from "./fetch";

function sendMessageTeacher(chatbot_id, message, token) {
  return fetch_post('obtenerRespuestaProfesor', {
    tema_id: chatbot_id,
    consulta: message,
    profesor_id: token
  })
}

function sendMessageStudent(chatbot_id, message, token) {
  return fetch_post('obtenerRespuestaAlumno', {
    tema_id: chatbot_id,
    consulta: message,
    alumno_id: token
  })
}

export { sendMessageTeacher, sendMessageStudent }