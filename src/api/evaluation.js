export default (_fetch, fetch_get) => ({
  getAll(session_id) {
    return fetch_get(`evaluation?session_id=${session_id || ''}`);
  },
  update(id, time_end) {
    return _fetch('PATCH', 'evaluation', {
      id, time_end
    });
  },
});
