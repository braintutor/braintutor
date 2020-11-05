import { fetch_post } from "./fetch";

function updateMaterialCategory(material_id, category, data) {
  return fetch_post("updateMaterialCategory", {
    material_id,
    category,
    data,
  });
}

function updateMaterialUnit(id, unit_id) {
  return fetch_post("updateMaterialUnit", {
    id,
    unit_id,
  });
}

function updateMaterialDocuments(material_id, documents) {
  return fetch_post("updateMaterialDocuments", {
    material_id,
    documents,
  });
}

function updateMaterial(id, name, description) {
  return fetch_post("updateMaterial", {
    id,
    name,
    description,
  });
}

function updateMaterialQuiz(id, quiz, quiz_type) {
  return fetch_post("updateMaterialQuiz", {
    id,
    quiz,
    quiz_type,
  });
}

function updateMaterialImage(id, image) {
  return fetch_post("updateMaterialImage", {
    id,
    image,
  });
}

function removeMaterial(material_id) {
  return fetch_post("removeMaterial", {
    material_id,
  });
}

export {
  updateMaterialCategory,
  updateMaterialUnit,
  updateMaterialDocuments,
  updateMaterial,
  updateMaterialImage,
  updateMaterialQuiz,
  removeMaterial,
};
