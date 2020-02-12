import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists(),
    //Resources
    resources: [],
    resource_selected: null,
    items: [],
    item_idx: 0,
    //Evaluations
    timer: null,
    //Components
    component_avatar: null
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
    setResource(state, { resource, items }) {
      state.resource_selected = resource
      state.items = items || [
        "texto",
        "video",
        "documento",
        "imagen",
        "quiz",
        "ejemplos",
        "importancia",
        "explicacion",
        "faq"
      ]
      state.item_idx = 0
    },
    setItemIdx(state, item_idx) {
      state.item_idx = item_idx
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
    }
  },
  actions: {
  },
  modules: {
  }
})
