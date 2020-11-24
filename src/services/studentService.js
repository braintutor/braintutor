import { fetch_get, fetch_post } from "./fetch";

function getStudentsByClassroomDirector(classroom_id) {
  return fetch_post("getStudentsByClassroomDirector", {
    classroom_id,
  });
}

function getStudentsBySession(session_id) {
  return fetch_post("getStudentsBySession", {
    session_id,
  });
}

function getStudentsBySessionStudent(session_id) {
  return fetch_post("getStudentsBySessionStudent", {
    session_id,
  });
}

function getStudentsByParent() {
  return fetch_get("getStudentsByParent");
}

function updateStudentProgress(course_id, materials) {
  return fetch_post("updateStudentProgress", {
    course_id,
    materials,
  });
}

function updateStudentParent(_id, parent_id) {
  return fetch_post("updateStudentParent", {
    _id,
    parent_id,
  });
}

function updateStudentTime() {
  return fetch_get("updateStudentTime");
}

function removeStudent(_id) {
  return fetch_post("removeStudent", {
    _id,
  });
}

function updateLearningStyle(learning_style) {
  return fetch_post("updateLearningStyle", {
    learning_style,
  });
}

function getCategoriesByLearningStyle() {
  return fetch_get("getCategoriesByLearningStyle");
}

export {
  getStudentsByClassroomDirector,
  getStudentsBySession,
  getStudentsBySessionStudent,
  getStudentsByParent,
  updateStudentProgress,
  updateStudentParent,
  updateStudentTime,
  removeStudent,
  updateLearningStyle,
  getCategoriesByLearningStyle,
};
