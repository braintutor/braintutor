import { fetch_post } from "./fetch";

function getMaterial(material_id) {
  return fetch_post('getMaterial', {
    material_id
  })
}

function getMaterialsByCourseTeacher(course_id) {
  return fetch_post('getMaterialsByCourseTeacher', {
    course_id
  })
}
function getMaterialsByCourseStudent(course_id) {
  return fetch_post('getMaterialsByCourseStudent', {
    course_id
  })
}

function addMaterial(chatbot_id, material) {
  return fetch_post('addMaterial', {
    chatbot_id,
    material
  })
}

function updateMaterialCategory(material_id, category, data) {
  return fetch_post('updateMaterialCategory', {
    material_id, category, data
  })
}

function updateMaterialDocuments(material_id, documents) {
  return fetch_post('updateMaterialDocuments', {
    material_id, documents
  })
}

function updateMaterial(id, name, description) {
  return fetch_post('updateMaterial', {
    id, name, description
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

export {
  getMaterial,
  getMaterialsByCourseTeacher,
  getMaterialsByCourseStudent,
  addMaterial,
  updateMaterialCategory,
  updateMaterialDocuments,
  updateMaterial,
  updateMaterialImage,
  updateMaterialQuiz,
  removeMaterial
}