export default (_fetch) => ({
  getAll() {
    return _fetch('GET', `teacher`);
  },
  createMassive(data) {
    return _fetch('POST', `teacher/load`, data);
  },
});
