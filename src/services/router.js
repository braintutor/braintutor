import router from '../router'

function redirect(name, params) {
  router.push({ name, params }).catch(() => { })
}

function getParam(param) {
  return this.$router.currentRoute.params[param]
}

export { redirect, getParam }