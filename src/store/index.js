import Vue from 'vue'
import Vuex from 'vuex'

import { sessionExists } from '@/services/security'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session_exists: sessionExists(),
    resources: [],
    resource_selected: null,
    items: [],
    item_idx: 0,
    //Components
    component_avatar: null
  },
  mutations: {
    setSessionExists(state, session_exists) {
      state.session_exists = session_exists
    },
    setResources(state, resources) {
      state.resources = resources
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
