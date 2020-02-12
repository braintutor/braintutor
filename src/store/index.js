import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists(),
    //Resources
    resources: [],
    //Evaluations
    timer: null,
    //Components
    component_avatar: null,
    component_resources: null,
    component_evaluations: null,
  },
  mutations: {
    setSessionExists(state, session_exists) {
      state.session_exists = session_exists
    },
    //Resources
    setResources(state, resources) {
      state.resources = resources
      state.resource_selected = null
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
    setComponentResources(state, component_resources) {
      state.component_resources = component_resources
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
