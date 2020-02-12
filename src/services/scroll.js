function scrollTopWindow() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollDown(element_id) {
  var element = document.getElementById(element_id);
  setTimeout(() => {
    element.scrollTop = element.scrollHeight;
  }, 0);
}

export { scrollTopWindow, scrollDown }