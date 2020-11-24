export default (_fetch) => ({
  getAll({ grade_id }) {
    return _fetch('GET', `section?grade_id=${grade_id}`);
  },
  add({ grade_id, name }) {
    return _fetch('POST', 'section', { grade_id, name });
  },
  update(section_id, { name }) {
    return _fetch('PATCH', `section/${section_id}`, { name });
  },
  remove(section_id) {
    return _fetch('DELETE', `section/${section_id}`);
  },
});
