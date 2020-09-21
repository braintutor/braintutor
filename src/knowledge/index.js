import store from "../store";
import course_editor_knowledge from "./course-editor.knowledge";
import material_editor_knowledge from "./material-editor.knowledge";
import session_editor_knowledge from "./session-editor.knowledge";

const nameToKnowledge = {
  "course-editor": course_editor_knowledge,
  "material-editor": material_editor_knowledge,
  "session-editor": session_editor_knowledge,
};

const onRouterChange = (name) => {
  if (name in nameToKnowledge) {
    store.commit("show_chatbot", true);
    store.commit("knowledge", nameToKnowledge[name]);
  } else {
    store.commit("show_chatbot", false);
    store.commit("knowledge", []);
  }
};

export { onRouterChange };
