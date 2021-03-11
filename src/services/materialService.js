import { fetch_post } from "./fetch";

function updateMaterialCategory(material_id, category, data) {
  return fetch_post("updateMaterialCategory", {
    material_id,
    category,
    data,
  });
}

function updateMaterial(id, title, isPrivate) {
  return fetch_post("updateMaterial", {
    id,
    title,
    is_private: isPrivate,
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
  updateMaterial,
  updateMaterialImage,
  removeMaterial,
};
