import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    loading_msg: '',
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    loading(state, loading) {
      state.loading = loading
    },
    loading_msg(state, loading_msg) {
      state.loading_msg = loading_msg
    }
  },
  actions: {
  },
  modules: {
  }
})
