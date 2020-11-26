export default (_fetch) => ({
  get(session_id) {
    return _fetch('GET', `session/${session_id}`);
  },
  getAll({ grade_id, section_id, course_id, teacher_id }) {
    return _fetch('GET', `session?grade_id=${grade_id || ''}&section_id=${section_id || ''}&course_id=${course_id || ''}&teacher_id=${teacher_id || ''}`);
  },
  add(data) {
    return _fetch('POST', 'session', data);
  },
  update(session_id, data) {
    return _fetch('PATCH', `session/${session_id}`, data);
  },
  remove(session_id) {
    return _fetch('DELETE', `session/${session_id}`);
  },
});
