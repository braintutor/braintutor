export default (fetch_get) => ({
  getAll(session_id) {
    return fetch_get(`task?session_id=${session_id || ''}`);
  },
});
