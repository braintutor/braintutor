export default (_fetch) => ({
  getAll(session_id) {
    return _fetch('GET', `evaluation?session_id=${session_id || ''}`);
  },
  update(id, time_end) {
    return _fetch('PATCH', 'evaluation', {
      id, time_end
    });
  },
});
