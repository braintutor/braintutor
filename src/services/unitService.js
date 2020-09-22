import { fetch_post } from "./fetch";

function getUnitsByCourseTeacher(course_id) {
  return fetch_post("getUnitsByCourseTeacher", {
    course_id,
  });
}

function getUnitsByCourseStudent(course_id) {
  return fetch_post("getUnitsByCourseStudent", {
    course_id,
  });
}

function getUnitsAndMaterials(course_id) {
  return fetch_post("getUnitsAndMaterials", {
    course_id,
  });
}

function addUnit(course_id, unit) {
  return fetch_post("addUnit", {
    course_id,
    unit,
  });
}

function updateUnit(unit) {
  return fetch_post("updateUnit", {
    unit,
  });
}

function updateUnitOrder(id, order) {
  return fetch_post("updateUnitOrder", {
    id,
    order,
  });
}

function removeUnit(id) {
  return fetch_post("removeUnit", {
    id,
  });
}

export {
  getUnitsByCourseTeacher,
  getUnitsByCourseStudent,
  getUnitsAndMaterials,
  addUnit,
  updateUnit,
  updateUnitOrder,
  removeUnit,
};
