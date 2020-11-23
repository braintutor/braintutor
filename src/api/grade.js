export default (_fetch) => ({
  getAll() {
    return _fetch('GET', "grade");
  },
  add({ name }) {
    return _fetch('POST', 'grade', { name });
  },
  update(grade_id, { name }) {
    return _fetch('PATCH', `grade/${grade_id}`, { name });
  },
  remove(grade_id) {
    return _fetch('DELETE', `grade/${grade_id}`);
  },
});
