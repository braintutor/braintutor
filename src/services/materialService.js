import { fetch_post } from "./fetch";

function getMaterials(chatbot_id) {
  return fetch_post('getMaterials', {
    chatbot_id
  })
}

function addMaterial(chatbot_id, material) {
  return fetch_post('addMaterial', {
    chatbot_id,
    material
  })
}

function updateMaterial(material) {
  return fetch_post('updateMaterial', {
    material
  })
}

function removeMaterial(material_id) {
  return fetch_post('removeMaterial', {
    material_id
  })
}

export { getMaterials, addMaterial, updateMaterial, removeMaterial }