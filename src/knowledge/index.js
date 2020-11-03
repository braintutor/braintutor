// import store from "../store";
// import course_editor_knowledge from "./course-editor.knowledge";
// import material_editor_knowledge from "./material-editor.knowledge";
// import teacher_session_knowledge from "./teacher-session.knowledge";

// const nameToKnowledge = {
//   "course-editor": course_editor_knowledge,
//   "material-editor": material_editor_knowledge,
//   "teacher-session": teacher_session_knowledge,
// };

// const onRouterChange = (name) => {
//   if (name in nameToKnowledge) {
//     store.commit("show_chatbot", true);
//     store.commit("knowledge", nameToKnowledge[name]);
//   } else {
//     store.commit("show_chatbot", false);
//     store.commit("knowledge", []);
//   }
// };

// export { onRouterChange };



// TODO: Remove
import store from "../store";

const onRouterChange = () => {
  store.commit("show_chatbot", false);
  store.commit("knowledge", []);
};

export { onRouterChange };