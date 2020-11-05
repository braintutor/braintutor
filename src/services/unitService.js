import { fetch_post } from "./fetch";

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
  addUnit,
  updateUnit,
  updateUnitOrder,
  removeUnit,
};
