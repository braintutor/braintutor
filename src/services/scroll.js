function scrollTopWindow() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollLeft(element_id) {
  var element = document.getElementById(element_id);
  element.scrollTo({ left: 0, behavior: 'smooth' });
}
function scrollRight(element_id) {
  var element = document.getElementById(element_id);
  element.scrollTo({
    left: 1000,
    behavior: 'smooth'
  });
}
function scrollDown(element_id) {
  var element = document.getElementById(element_id);
  element.scrollTo({
    top: 20000,
    behavior: 'smooth'
  });
  // setTimeout(() => {
  //   element.scrollTop = element.scrollHeight;
  // }, 0);
}

export { scrollTopWindow, scrollLeft, scrollRight, scrollDown }