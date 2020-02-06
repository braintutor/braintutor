import { fetch_get, fetch_post } from "./constants";

function getResources(chatbot_id) {
  return fetch_post('obtenerMaterialPorTema', {
    tema_id: chatbot_id
  })
}

function getResourcesQuestions() {
  return fetch_get('obtenerPreguntaMaterial')
}

export { getResources, getResourcesQuestions }