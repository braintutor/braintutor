import Vue from "vue";
import Vuex from "vuex";
import { knowledge_course_editor, knowledge_session_editor } from "./knowledge";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    loading_msg: "",
    material: null,
    // Chatbot
    show_chatbot: false,
    loading_knowledge: false,
    knowledge: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    loading(state, loading) {
      state.loading = loading;
    },
    loading_msg(state, loading_msg) {
      state.loading_msg = loading_msg;
    },
    setMaterial(state, material) {
      state.material = material;
    },
    // Chatbot
    show_chatbot(state, show_chatbot) {
      state.show_chatbot = show_chatbot;
    },
    loading_knowledge(state, loading_knowledge) {
      state.loading_knowledge = loading_knowledge;
    },
    knowledge(state, knowledge) {
      state.knowledge = knowledge;
    },
    knowledge_default(state, key) {
      let new_knowledge = {
        CE: knowledge_course_editor,
        SE: knowledge_session_editor,
      }[key];
      state.knowledge = new_knowledge;
    },
  },
  actions: {},
  modules: {},
});
