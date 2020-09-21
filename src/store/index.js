import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    loading_msg: "",
    material: null,
    // Chatbot
    show_chatbot: false,
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
    knowledge(state, knowledge) {
      state.knowledge = knowledge;
    },
  },
  actions: {},
  modules: {},
});
