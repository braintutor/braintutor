import { fetch_post } from "./fetch";

function getMaterial(material_id) {
  return fetch_post('getMaterial', {
    material_id
  })
}

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

function updateMaterialName(id, name) {
  return fetch_post('updateMaterialName', {
    id, name
  })
}

function updateMaterialQuiz(id, quiz, quiz_type) {
  return fetch_post('updateMaterialQuiz', {
    id, quiz, quiz_type
  })
}

function updateMaterialImage(id, image) {
  return fetch_post('updateMaterialImage', {
    id, image
  })
}

function removeMaterial(material_id) {
  return fetch_post('removeMaterial', {
    material_id
  })
}

export { getMaterial, getMaterials, addMaterial, updateMaterial, updateMaterialName, updateMaterialImage, updateMaterialQuiz, removeMaterial }