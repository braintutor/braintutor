import { fetch_post } from "./fetch";

function getKnowledge(chatbot_id) {
  return fetch_post('obtenerConocimientoPorTema', {
    tema_id: chatbot_id
  })
}

export { getKnowledge }