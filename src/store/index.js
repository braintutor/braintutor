import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists(),
    resources: []
  },
  mutations: {
    setSessionExists(state, session_exists) {
      state.session_exists = session_exists
    },
    setResources(state, resources) {
      state.resources = resources
    }
  },
  actions: {
  },
  modules: {
  }
})
