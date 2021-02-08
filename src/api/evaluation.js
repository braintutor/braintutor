export default (_fetch) => ({
  update(id, time_end) {
    return _fetch('PATCH', 'evaluation', {
      id, time_end
    });
  },
  getSessionResults(session_id) {
    return _fetch('GET', `evaluation2/session-result/${session_id}`);
  }
});
