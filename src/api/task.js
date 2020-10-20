export default (_fetch) => ({
  getAll(session_id) {
    return _fetch('GET', `task?session_id=${session_id || ''}`);
  },
  update(task_id, data) {
    return _fetch('PATCH', `task/${task_id}`, data);
  },
});
