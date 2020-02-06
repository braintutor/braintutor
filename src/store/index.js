import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists(),
    resources: [],
    resource_selected: null
  },
  mutations: {
    setSessionExists(state, session_exists) {
      state.session_exists = session_exists
    },
    setResources(state, resources) {
      state.resources = resources
    },
    setResourceSelected(state, resource_selected) {
      state.resource_selected = resource_selected
    }
  },
  actions: {
  },
  modules: {
  }
})
