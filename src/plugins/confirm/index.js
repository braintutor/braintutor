import Vue from 'vue'
import Confirm from './plugin.js'
import ConfirmDialog from "./component";

Vue.use(Confirm)
Vue.component('vue-confirm', ConfirmDialog)