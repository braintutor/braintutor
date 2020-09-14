import { fetch_get, fetch_post } from "./fetch";

function getStudentsByClassroom(classroom_id) {
  return fetch_post("getStudentsByClassroom", {
    classroom_id,
  });
}

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

function addStudent(user) {
  return fetch_post("addStudent", {
    user,
  });
}

function updateStudent(user) {
  return fetch_post("updateStudent", {
    user,
  });
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
  getStudentsByClassroom,
  getStudentsByClassroomDirector,
  getStudentsBySession,
  getStudentsBySessionStudent,
  getStudentsByParent,
  addStudent,
  updateStudent,
  updateStudentProgress,
  updateStudentParent,
  updateStudentTime,
  removeStudent,
  updateLearningStyle,
  getCategoriesByLearningStyle,
};
