import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists()
  },
  mutations: {
    setSessionExists(state, bool) {
      state.session_exists = bool
    }
  },
  actions: {
  },
  modules: {
  }
})
