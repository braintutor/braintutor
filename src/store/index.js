import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: false
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
