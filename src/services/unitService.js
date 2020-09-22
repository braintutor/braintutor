import { fetch_post } from "./fetch";

function getUnitsByCourseTeacher(course_id) {
  return fetch_post("getChatbotsByCourseTeacher", {
    course_id,
  });
}

function getUnitsByCourseStudent(course_id) {
  return fetch_post("getChatbotsByCourseStudent", {
    course_id,
  });
}

function getUnitsAndMaterials(course_id) {
  return fetch_post("getChatbotsAndMaterials", {
    course_id,
  });
}

function addUnit(course_id, chatbot) {
  return fetch_post("addChatbot", {
    course_id,
    chatbot,
  });
}

function updateUnit(chatbot) {
  return fetch_post("updateChatbot", {
    chatbot,
  });
}

function updateUnitOrder(id, order) {
  return fetch_post("updateChatbotOrder", {
    id,
    order,
  });
}

function removeUnit(id) {
  return fetch_post("removeChatbot", {
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
