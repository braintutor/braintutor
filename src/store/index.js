import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    //Materials
    materials: [],
    //Quizzes
    timer: null,
    //Components
    component_avatar: null,
    component_materials: null,
    component_quizzes: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    //Materials
    setMaterials(state, materials) {
      state.materials = materials
      state.material_selected = null
    },
    //Quizzes
    clearTimer(state) {
      clearInterval(state.timer);
    },
    setTimer(state, timer) {
      state.timer = timer
    },
    //Components
    setComponentAvatar(state, component_avatar) {
      state.component_avatar = component_avatar
    },
    setComponentMaterials(state, component_materials) {
      state.component_materials = component_materials
    },
    setComponentQuizzes(state, component_quizzes) {
      state.component_quizzes = component_quizzes
    },
  },
  actions: {
  },
  modules: {
  }
})
