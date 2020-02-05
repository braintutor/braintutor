import router from '../router'

function redirect(name) {
  router.push({ name }).catch(() => { })
}

function scrollDown(element_id) {
  var element = document.getElementById(element_id);
  setTimeout(() => {
    element.scrollTop = element.scrollHeight;
  }, 0);
}

export { redirect, scrollDown }