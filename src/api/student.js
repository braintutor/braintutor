export default (_fetch) => ({
  get(student_id) {
    return _fetch('GET', `student/${student_id}`);
  },
  getAll({ grade_id, section_id, parent_id }) {
    return _fetch('GET', `student?grade_id=${grade_id || ''}&section_id=${section_id || ''}&parent_id=${parent_id || ''}`
    );
  },
  add(data) {
    return _fetch('POST', 'student', data);
  },
  update(user_id, data) {
    return _fetch('PATCH', `student/${user_id}`, data);
  },
});
