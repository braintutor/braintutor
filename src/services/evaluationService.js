import { fetch_post } from "./fetch";

function getEvaluations(chatbot_id) {
  return fetch_post('obtenerCuestionarioPorTema', {
    tema_id: chatbot_id
  })
}

export { getEvaluations }