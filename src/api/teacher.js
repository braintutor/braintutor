export default (_fetch) => ({
  getAll() {
    return _fetch('GET', `teacher`);
  },
});
