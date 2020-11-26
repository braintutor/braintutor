export default (_fetch) => ({
  getAll() {
    return _fetch('GET', "grade");
  },
  add(data) {
    return _fetch('POST', 'grade', data);
  },
  update(grade_id, data) {
    return _fetch('PATCH', `grade/${grade_id}`, data);
  },
  remove(grade_id) {
    return _fetch('DELETE', `grade/${grade_id}`);
  },
});
