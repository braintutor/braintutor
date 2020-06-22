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

function updateMaterialName(material_id, name) {
  return fetch_post('updateMaterialName', {
    material_id, name
  })
}

function updateMaterialQuiz(material_id, quiz, quiz_type) {
  return fetch_post('updateMaterialQuiz', {
    material_id, quiz, quiz_type
  })
}

function updateMaterialImage(material) {
  return fetch_post('updateMaterialImage', {
    material
  })
}

function removeMaterial(material_id) {
  return fetch_post('removeMaterial', {
    material_id
  })
}

export { getMaterials, addMaterial, updateMaterial, updateMaterialName, updateMaterialImage, updateMaterialQuiz, removeMaterial }