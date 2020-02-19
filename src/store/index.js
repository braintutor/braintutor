import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists(),
    //Materials
    materials: [],
    //Evaluations
    timer: null,
    //Components
    component_avatar: null,
    component_materials: null,
    component_evaluations: null,
  },
  mutations: {
    setSessionExists(state, session_exists) {
      state.session_exists = session_exists
    },
    //Materials
    setMaterials(state, materials) {
      state.materials = materials
      state.material_selected = null
    },
    //Evaluations
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
    setComponentEvaluations(state, component_evaluations) {
      state.component_evaluations = component_evaluations
    }
  },
  actions: {
  },
  modules: {
  }
})
